const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");

const { config: env } = require("../config/env");

const ai = env.geminiApiKey
  ? new GoogleGenAI({
      apiKey: env.geminiApiKey,
    })
  : null;

const linkSchema = {
  type: Type.OBJECT,
  required: ["label", "url"],
  properties: {
    label: {
      type: Type.STRING,
    },
    url: {
      type: Type.STRING,
    },
  },
};

const responseSchema = {
  type: Type.OBJECT,

  required: [
    "basics",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "interests",
    "extraSections",
  ],

  properties: {
    basics: {
      type: Type.OBJECT,

      required: ["name", "title", "location", "email", "phone", "links"],

      properties: {
        name: {
          type: Type.STRING,
        },

        title: {
          type: Type.STRING,
        },

        location: {
          type: Type.STRING,
        },

        email: {
          type: Type.STRING,
        },

        phone: {
          type: Type.STRING,
        },

        links: {
          type: Type.ARRAY,
          items: linkSchema,
        },
      },
    },

    summary: {
      type: Type.STRING,
    },

    experience: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: ["company", "role", "period", "location", "bullets"],

        properties: {
          company: {
            type: Type.STRING,
          },

          role: {
            type: Type.STRING,
          },

          period: {
            type: Type.STRING,
          },

          location: {
            type: Type.STRING,
          },

          bullets: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },

    education: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: ["degree", "school", "period", "location", "details"],

        properties: {
          degree: {
            type: Type.STRING,
          },

          school: {
            type: Type.STRING,
          },

          period: {
            type: Type.STRING,
          },

          location: {
            type: Type.STRING,
          },

          details: {
            type: Type.STRING,
          },
        },
      },
    },

    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },

    projects: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: ["name", "description", "tech", "links", "bullets"],

        properties: {
          name: {
            type: Type.STRING,
          },

          description: {
            type: Type.STRING,
          },

          tech: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          links: {
            type: Type.ARRAY,
            items: linkSchema,
          },

          bullets: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },

    certifications: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: ["name", "issuer", "year"],

        properties: {
          name: {
            type: Type.STRING,
          },

          issuer: {
            type: Type.STRING,
          },

          year: {
            type: Type.STRING,
          },
        },
      },
    },

    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },

    interests: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },

    extraSections: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        required: ["title", "items"],

        properties: {
          title: {
            type: Type.STRING,
          },

          items: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  },
};

const validator = z.object({
  basics: z.object({
    name: z.string().default(""),

    title: z.string().default(""),

    location: z.string().default(""),

    email: z.string().default(""),

    phone: z.string().default(""),

    links: z
      .array(
        z.object({
          label: z.string().default(""),
          url: z.string().default(""),
        }),
      )
      .default([]),
  }),

  summary: z.string().default(""),

  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        role: z.string().default(""),
        period: z.string().default(""),
        location: z.string().default(""),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),

  education: z
    .array(
      z.object({
        degree: z.string().default(""),
        school: z.string().default(""),
        period: z.string().default(""),
        location: z.string().default(""),
        details: z.string().default(""),
      }),
    )
    .default([]),

  skills: z.array(z.string()).default([]),

  projects: z
    .array(
      z.object({
        name: z.string().default(""),

        description: z.string().default(""),

        tech: z.array(z.string()).default([]),

        links: z
          .array(
            z.object({
              label: z.string().default(""),
              url: z.string().default(""),
            }),
          )
          .default([]),

        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),

  certifications: z
    .array(
      z.object({
        name: z.string().default(""),
        issuer: z.string().default(""),
        year: z.string().default(""),
      }),
    )
    .default([]),

  languages: z.array(z.string()).default([]),

  interests: z.array(z.string()).default([]),

  extraSections: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.string()).default([]),
      }),
    )
    .default([]),
});
function getUrls(extractedLinks = []) {
  return extractedLinks
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return (item?.url || "").trim();
    })
    .filter(Boolean);
}

function upsertBasicLink(links, label, url) {
  if (!url) return;

  const found = links.find(
    (item) => item.label?.toLowerCase().trim() === label.toLowerCase(),
  );

  if (found) {
    if (!found.url) {
      found.url = url;
    }

    return;
  }

  links.push({
    label,
    url,
  });
}

function enrichParsedLinks(parsed, extractedLinks = []) {
  if (!parsed?.basics) {
    return parsed;
  }

  parsed.basics.links = parsed.basics.links || [];

  const urls = getUrls(extractedLinks);

  const githubUrl = urls.find((url) => /github\.com/i.test(url));

  const linkedinUrl = urls.find((url) => /linkedin\.com/i.test(url));

  upsertBasicLink(parsed.basics.links, "GitHub", githubUrl);

  upsertBasicLink(parsed.basics.links, "LinkedIn", linkedinUrl);

  /*
    Fill project links that Gemini missed.
    We don't guess project ownership here;
    we only try a conservative hostname/name match.
  */
  for (const project of parsed.projects || []) {
    project.links = project.links || [];

    if (project.links.some((link) => link.url)) {
      continue;
    }

    const projectName = (project.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

    const candidate = urls.find((url) => {
      if (/github\.com|linkedin\.com/i.test(url)) {
        return false;
      }

      const normalizedUrl = url.toLowerCase().replace(/[^a-z0-9]+/g, "");

      const words = (project.name || "")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length >= 4);

      return words.some((word) => normalizedUrl.includes(word));
    });

    if (candidate) {
      project.links.push({
        label: "Live Link",
        url: candidate,
      });
    }
  }

  return parsed;
}
function buildPrompt(rawText, extractedLinks = []) {
  return [
    "You are a resume parser.",
    "The input is raw text extracted from a PDF, so some lines may be broken or slightly out of order.",
    "",
    "PDF EMBEDDED LINKS:",
    "These URLs were extracted from clickable hyperlinks embedded in the original PDF.",
    "Use them when matching GitHub, LinkedIn, Portfolio, project live links, credentials, and other links.",
    "Do not invent URLs.",
    "Do not discard extracted URLs.",
    "",
    JSON.stringify(extractedLinks, null, 2),
    "",
    "LINK MATCHING RULES:",
    "- A URL containing github.com should normally be matched to GitHub.",
    "- A URL containing linkedin.com should normally be matched to LinkedIn.",
    "- Portfolio/personal website URLs should be matched to Portfolio or Website.",
    "- Project deployment URLs such as vercel.app, netlify.app, web.app, or similar should be assigned to the relevant project when context allows.",
    "- Preserve all project links that clearly belong to projects.",
    "",

    "Extract the resume into the exact structured JSON schema provided.",

    "",

    "BASICS:",
    "- Extract candidate name.",
    "- Extract professional/job title.",
    "- Extract location, email, phone.",
    "- Extract LinkedIn, GitHub, portfolio, website, or other profile URLs into links.",
    '- Each link must contain a label such as "LinkedIn", "GitHub", "Portfolio", or "Website".',

    "",

    "SUMMARY:",
    "- Extract the professional summary/profile.",
    "- Join lines that belong to the same paragraph.",

    "",

    "EXPERIENCE:",
    "- Extract every work experience entry.",
    "- Include role, company, date period, location, and bullet points.",
    "- Keep original date wording whenever possible.",
    "- Do not invent work experience if none exists.",

    "",

    "EDUCATION:",
    "- Extract every degree and institution.",
    "- Include period and location only when clearly present.",
    "- If something is missing, use an empty string.",

    "",

    "SKILLS:",
    "- Extract individual technical or professional skills as a flat array.",
    "- If the resume groups skills as Frontend, Backend, Database, Deployment, Tools, Cloud, etc., extract the individual skills.",
    "- Do not lose any clearly stated skill.",

    "",

    "PROJECTS:",
    "- Extract EVERY project separately.",
    "- Preserve the exact project name.",
    "- Extract the project URL when it is explicitly present.",
    "- Put all project URLs inside links as { label, url }.",
    "- Extract all technologies into tech.",
    "- Preserve EVERY meaningful project bullet.",
    "- Each source bullet must become a separate item inside bullets.",
    "- Never merge multiple bullets into description.",
    "- Never discard project bullets.",
    "- Do not summarize several bullets into one bullet.",
    "- description should only contain a short project overview if one is actually present.",
    "- If the source has no standalone description, description may be empty.",
    "- Symbols such as •, , , -, * can all indicate bullets.",

    "- CRITICAL: A project with 4 source bullets should normally return 4 bullets.",
    "- Do not replace source project bullets with a single generated summary.",
    "CERTIFICATIONS / PROFESSIONAL TRAINING:",
    "- Extract courses, certifications, and professional training.",
    "- Use certifications for professional training items too.",
    "- Extract issuer and year when available.",

    "",

    "LANGUAGES:",
    "- Extract spoken/written languages when present.",

    "",

    "INTERESTS:",
    "- Extract interests/hobbies when present.",

    "",

    "EXTRA SECTIONS:",
    "- Preserve any meaningful resume section that does not fit the standard fields.",
    "- Put those sections in extraSections.",
    "- Examples include Achievements, Awards, Publications, Research, Volunteer Experience, Activities, References, Courses, Career Objective, Additional Information, Memberships.",
    "- Each extra section must have its original meaningful title and an array of text items.",
    "- Never silently discard a section.",

    "",

    "IMPORTANT RULES:",
    "- Do not invent facts.",
    "- Preserve all meaningful resume content.",
    "- Use empty strings or arrays when information is not present.",
    "- Do not create sections that are not supported by the source resume.",
    "- PDF extraction may scramble heading order; use context.",
    "- Preserve ATS-friendly plain text wording.",
    "- Return JSON only.",
    "- Do not return markdown.",

    "",

    "RESUME TEXT",
    "-------------",
    rawText,
    "-------------",
  ].join("\n");
}

const EMPTY = {
  basics: {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    links: [],
  },

  summary: "",

  experience: [],

  education: [],

  skills: [],

  projects: [],

  certifications: [],

  languages: [],

  interests: [],

  extraSections: [],
};

async function parseResume(rawText, extractedLinks = []) {
  if (!rawText?.trim()) {
    return EMPTY;
  }

  if (!ai) {
    console.error("Structure parser: Gemini API key is not configured.");

    return EMPTY;
  }

  const prompt = buildPrompt(rawText, extractedLinks);

  let lastError;

  const candidateModels = [
    env.geminiModel,
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  for (let attempt = 0; attempt < candidateModels.length; attempt++) {
    const currentModel = candidateModels[attempt];
    try {
      const result = await ai.models.generateContent({
        model: currentModel,

        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        config: {
          responseMimeType: "application/json",

          responseSchema,

          temperature: 0.1,
        },
      });

      const text =
        typeof result.text === "function" ? result.text() : result.text;

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = JSON.parse(text);

      const validated = validator.parse(parsed);

      return enrichParsedLinks(validated, extractedLinks);
    } catch (error) {
      lastError = error;

      console.error(
        `Structured parse attempt ${attempt + 1} (${currentModel}) failed:`,
        error.message,
      );

      if (attempt === candidateModels.length - 1) {
        console.error(
          "Structured parse failed after all model attempts:",
          lastError.message,
        );

        return EMPTY;
      }

      // Wait 1.5s to mitigate temporary 503 high demand spikes
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return EMPTY;
}

module.exports = {
  parseResume,
};
