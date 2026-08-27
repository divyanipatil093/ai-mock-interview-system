import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";

export const analyzeResumeATS = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }
        const filepath = req.file.path

        const filebuffer = await fs.promises.readFile(filepath)
        const uint8Array = new Uint8Array(filebuffer)

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            resumeText += content.items.map(item => item.str).join(" ") + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        fs.unlinkSync(filepath)

                const messages = [
            {
                role: "system",
                content: `You are an experienced, fair ATS resume reviewer. Identify genuine,
                meaningful issues and score according to their actual severity — not by counting
                issues, and not by searching for problems that aren't really there.

                Classify issues by real-world severity:

                MINOR (very small score impact):
                - A skill listed twice with different casing/spacing in the same list
                  (e.g. "MongoDB" and "Mongo DB")
                - Generic soft skills with no supporting evidence
                - Missing portfolio/project link
                - Missing certification issuer/date
                - One or two small spelling mistakes

                MEANINGFUL (noticeable but moderate score impact):
                - Invalid or malformed email (missing "@" or missing a domain like ".com")
                - Weak, generic summary with no specific value proposition
                - Missing measurable outcomes in experience/projects
                - Multiple (3+) spelling/grammar errors across the document
                - Weak keyword alignment with the apparent target role
                - Personal info that shouldn't be on a resume (DOB, marital status, nationality)

                SERIOUS (should clearly and significantly lower the score):
                - Impossible or overlapping employment dates (end date before start date, or two
                  full-time roles overlapping in time)
                - Contradictory employment information (conflicting titles, dates, or responsibilities)
                - Major ATS-unfriendly structure that would genuinely break automated parsing
                  (e.g. critical info only inside tables/images, no discernible section structure)
                - A pattern of multiple vague, large, unverifiable claims stacked together with
                  nothing in the resume to support that level of scope or seniority
                - A claimed "certification" that is not a real issued credential
                - Missing an essential section entirely (no work experience, no education, no skills)

                Rules:
                - A skill listed once in Skills and again in Experience is normal — not a duplicate.
                - Note a single unverifiable claim as needing stronger context, but only treat it as
                  serious when several such claims stack together as a pattern.
                - Do not invent issues that aren't genuinely present, and do not go looking for
                  problems just to justify a lower score.
                - The score must track the real mix and severity of what you find.

                Scoring guide (use judgment, don't just count issues):
                - 9.0–10: clean, professional resume; at most trivial/no issues
                - 8.0–8.9: a few minor weaknesses only, nothing meaningful or serious
                - 6.5–7.9: one or two meaningful issues, no serious issue
                - 5.0–6.4: several meaningful issues, or exactly one serious issue
                - 3.5–4.9: one serious issue plus other meaningful issues, or two serious issues
                - Below 3.5: multiple serious issues or fundamental credibility/structural problems

                A resume should never land in the serious-issue score bands purely from minor
                formatting or wording nitpicks — only genuine, meaningful, or serious problems
                should pull the score down.

                ATS Status: 8.0-10 = "Yes", 6.0-7.9 = "Mostly", below 6.0 = "No".

                List up to 10 genuine issues found (fewer if fewer genuinely exist). Every issue
                must have a corresponding fix at the same array index. "suggestions" = optional
                broader improvements not already covered as a direct fix — these do not affect
                the score.

                Return STRICTLY valid JSON, nothing else, no markdown:
                {
                    "atsScore": number (0-10, one decimal place),
                    "atsFriendly": "Yes" | "Mostly" | "No",
                    "strengths": ["string"],
                    "issues": ["string"],
                    "fixes": ["string"],
                    "suggestions": ["string"],
                    "keywords": ["string"]
                }`
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const aiResponse = await askAi(messages)

        const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return res.status(200).json(parsed);

    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: `ATS analysis failed: ${error.message}` });
    }
};