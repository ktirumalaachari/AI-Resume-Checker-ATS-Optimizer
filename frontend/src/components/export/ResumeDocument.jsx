import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

const C = {
  ink: "#111111",
  muted: "#444444",
  accent: "#183b64",
  line: "#183b64",
  link: "#1a5f9e",
  bg: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 38,

    fontFamily: "Helvetica",
    fontSize: 8.5,
    lineHeight: 1.28,

    color: C.ink,
    backgroundColor: C.bg,
  },

  header: {
    alignItems: "center",
    marginBottom: 7,
  },

  name: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },

  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginBottom: 8,
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",

    fontSize: 7.7,
    color: C.ink,
  },

  contactItem: {
    marginHorizontal: 2,
  },

  separator: {
    marginHorizontal: 2,
    color: C.muted,
  },

  link: {
    color: C.link,
    textDecoration: "none",
  },

  section: {
    marginTop: 6,
  },

  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.3,
    color: C.accent,
    textTransform: "uppercase",
    marginBottom: 1.5,
  },

  sectionLine: {
    height: 0.75,
    backgroundColor: C.line,
    marginBottom: 4,
  },

  bodyText: {
    fontSize: 8.2,
    lineHeight: 1.32,
  },

  // skills
  skillRow: {
    flexDirection: "row",
    marginBottom: 1.5,
  },

  skillLabel: {
    width: 66,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.1,
  },

  skillValue: {
    flex: 1,
    fontSize: 8.1,
  },

  // experience
  item: {
    marginBottom: 5,
  },

  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.4,
  },

  itemMeta: {
    fontSize: 7.7,
    color: C.muted,
  },

  itemSub: {
    fontSize: 8,
    marginTop: 0.5,
    marginBottom: 1.5,
  },

  // bullets
  bullet: {
    flexDirection: "row",
    marginBottom: 1.3,
  },

  bulletSymbol: {
    width: 9,
    fontSize: 8,
  },

  bulletText: {
    flex: 1,
    fontSize: 8.1,
    lineHeight: 1.32,
  },

  // project
  projectHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
  },

  projectName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
  },

  projectSeparator: {
    marginHorizontal: 3,
  },

  projectLink: {
    fontSize: 8,
    color: C.link,
    textDecoration: "none",
  },

  techLine: {
    fontSize: 8,
    marginTop: 1,
    marginBottom: 2,
  },

  techLabel: {
    fontFamily: "Helvetica-Bold",
  },

  // education
  eduLine: {
    fontSize: 8.2,
    marginBottom: 2,
  },

  eduDegree: {
    fontFamily: "Helvetica-Bold",
  },

  // certifications
  certLine: {
    fontSize: 8.2,
    marginBottom: 2,
  },

  // extras
  simpleLine: {
    fontSize: 8.2,
    marginBottom: 1.5,
  },

  fallback: {
    fontSize: 8.2,
    whiteSpace: "pre-wrap",
  },
});

function SectionHeader({ children }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{children}</Text>

      <View style={styles.sectionLine} />
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletSymbol}>•</Text>

      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function normalizeUrl(url = "") {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:")
  ) {
    return url;
  }

  return `https://${url}`;
}

function shortenUrl(url = "") {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function classifySkills(skills = []) {
  const groups = {
    Frontend: [],
    Backend: [],
    Database: [],
    Deployment: [],
    Tools: [],
    Other: [],
  };

  const frontend = [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "next",
    "redux",
    "context",
    "tailwind",
    "bootstrap",
    "gsap",
    "sass",
    "vue",
    "angular",
  ];

  const backend = [
    "node",
    "express",
    "rest",
    "graphql",
    "jwt",
    "authentication",
    "websocket",
    "stripe",
    "nestjs",
  ];

  const database = [
    "mongodb",
    "mysql",
    "postgres",
    "postgresql",
    "prisma",
    "firebase realtime",
    "sql",
  ];

  const deployment = [
    "vercel",
    "netlify",
    "render",
    "railway",
    "docker",
    "aws",
    "firebase hosting",
    "ec2",
    "s3",
  ];

  const tools = [
    "git",
    "github",
    "vs code",
    "vscode",
    "postman",
    "figma",
    "jira",
  ];

  for (const skill of skills) {
    const s = String(skill || "").trim();

    if (!s) continue;

    const low = s.toLowerCase();

    if (frontend.some((x) => low.includes(x))) {
      groups.Frontend.push(s);
    } else if (backend.some((x) => low.includes(x))) {
      groups.Backend.push(s);
    } else if (database.some((x) => low.includes(x))) {
      groups.Database.push(s);
    } else if (deployment.some((x) => low.includes(x))) {
      groups.Deployment.push(s);
    } else if (tools.some((x) => low.includes(x))) {
      groups.Tools.push(s);
    } else {
      groups.Other.push(s);
    }
  }

  return groups;
}

function ContactLink({ label, url }) {
  if (!url) return null;

  return (
    <Link src={normalizeUrl(url)} style={[styles.contactItem, styles.link]}>
      {label || shortenUrl(url)}
    </Link>
  );
}

function GenericSection({ section }) {
  if (!section?.title || !section?.items?.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <SectionHeader>{section.title}</SectionHeader>

      {section.items.map((item, i) => (
        <Bullet key={i}>{item}</Bullet>
      ))}
    </View>
  );
}

export function ResumeDocument({ user, version, title }) {
  const p = version?.parsedSections || {};
  const basics = p.basics || {};

  const displayName = basics.name?.trim() || user?.name || "Your Name";

  const displayEmail = basics.email?.trim() || user?.email || "";

  const displayTitle = basics.title?.trim() || "";

  const hasStructuredContent = Boolean(
    p.summary ||
    p.experience?.length ||
    p.education?.length ||
    p.skills?.length ||
    p.projects?.length ||
    p.certifications?.length ||
    p.languages?.length ||
    p.interests?.length ||
    p.extraSections?.length,
  );

  const skillGroups = classifySkills(p.skills || []);

  return (
    <Document title={title || displayName || "Resume"} author={displayName}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.name}>{displayName}</Text>

          {displayTitle ? (
            <Text style={styles.title}>{displayTitle}</Text>
          ) : null}

          <View style={styles.contactRow}>
            {displayEmail ? (
              <>
                <Link
                  src={`mailto:${displayEmail}`}
                  style={[styles.contactItem, styles.link]}
                >
                  {displayEmail}
                </Link>

                <Text style={styles.separator}>|</Text>
              </>
            ) : null}

            {basics.phone ? (
              <>
                <Text style={styles.contactItem}>{basics.phone}</Text>

                {basics.links?.length ? (
                  <Text style={styles.separator}>|</Text>
                ) : null}
              </>
            ) : null}

            {(basics.links || [])
              .filter((link) => link?.url)
              .map((link, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <ContactLink key={index} label={link.label} url={link.url} />

                  {index < basics.links.length - 1 ? (
                    <Text style={styles.separator}>|</Text>
                  ) : null}
                </View>
              ))}
          </View>
        </View>

        {!hasStructuredContent && version?.rawText ? (
          <View style={styles.section}>
            <Text style={styles.fallback}>{version.rawText}</Text>
          </View>
        ) : (
          <>
            {/* PROFESSIONAL SUMMARY */}

            {p.summary ? (
              <View style={styles.section}>
                <SectionHeader>Professional Summary</SectionHeader>

                <Text style={styles.bodyText}>{p.summary}</Text>
              </View>
            ) : null}

            {/* EXPERIENCE */}

            {p.experience?.length ? (
              <View style={styles.section}>
                <SectionHeader>Experience</SectionHeader>

                {p.experience.map((exp, index) => (
                  <View key={index} style={styles.item} wrap={false}>
                    <View style={styles.itemTop}>
                      <Text style={styles.itemTitle}>
                        {exp.role || exp.company || "Experience"}
                      </Text>

                      {exp.period ? (
                        <Text style={styles.itemMeta}>{exp.period}</Text>
                      ) : null}
                    </View>

                    {exp.company || exp.location ? (
                      <Text style={styles.itemSub}>
                        {exp.company || ""}

                        {exp.company && exp.location ? " — " : ""}

                        {exp.location || ""}
                      </Text>
                    ) : null}

                    {(exp.bullets || []).map((bullet, i) => (
                      <Bullet key={i}>{bullet}</Bullet>
                    ))}
                  </View>
                ))}
              </View>
            ) : null}

            {/* TECHNICAL SKILLS */}

            {p.skills?.length ? (
              <View style={styles.section}>
                <SectionHeader>Technical Skills</SectionHeader>

                {Object.entries(skillGroups).map(([group, skills]) =>
                  skills.length ? (
                    <View key={group} style={styles.skillRow}>
                      <Text style={styles.skillLabel}>{group} :</Text>

                      <Text style={styles.skillValue}>{skills.join(", ")}</Text>
                    </View>
                  ) : null,
                )}
              </View>
            ) : null}

            {/* PROJECTS */}

            {p.projects?.length ? (
              <View style={styles.section}>
                <SectionHeader>Projects</SectionHeader>

                {p.projects.map((project, index) => (
                  <View key={index} style={styles.item}>
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectName}>
                        {project.name || "Project"}
                      </Text>

                      {project.links?.[0]?.url ? (
                        <>
                          <Text style={styles.projectSeparator}>{" | "}</Text>

                          <Link
                            src={normalizeUrl(project.links[0].url)}
                            style={styles.projectLink}
                          >
                            {shortenUrl(project.links[0].url)}
                          </Link>
                        </>
                      ) : null}
                    </View>

                    {project.tech?.length ? (
                      <Text style={styles.techLine}>
                        <Text style={styles.techLabel}>Technologies:</Text>{" "}
                        {project.tech.join(", ")}
                      </Text>
                    ) : null}

                    {project.description ? (
                      <Text style={styles.bodyText}>{project.description}</Text>
                    ) : null}

                    {(project.bullets || []).map((bullet, bulletIndex) => (
                      <Bullet key={bulletIndex}>{bullet}</Bullet>
                    ))}
                  </View>
                ))}
              </View>
            ) : null}

            {/* EDUCATION */}

            {p.education?.length ? (
              <View style={styles.section}>
                <SectionHeader>Education</SectionHeader>

                {p.education.map((edu, index) => (
                  <View key={index} wrap={false}>
                    <Text style={styles.eduLine}>
                      <Text style={styles.eduDegree}>{edu.degree}</Text>

                      {edu.school ? ` - ${edu.school}` : ""}

                      {edu.location ? `, ${edu.location}` : ""}

                      {edu.period ? ` (${edu.period})` : ""}
                    </Text>

                    {edu.details ? (
                      <Text style={styles.itemMeta}>{edu.details}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}

            {/* PROFESSIONAL TRAINING */}

            {p.certifications?.length ? (
              <View style={styles.section}>
                <SectionHeader>Professional Training</SectionHeader>

                {p.certifications.map((cert, index) => (
                  <Text key={index} style={styles.certLine}>
                    {cert.name}

                    {cert.issuer ? ` - ${cert.issuer}` : ""}

                    {cert.year ? `, ${cert.year}` : ""}
                  </Text>
                ))}
              </View>
            ) : null}

            {/* LANGUAGES */}

            {p.languages?.length ? (
              <View style={styles.section}>
                <SectionHeader>Languages</SectionHeader>

                <Text style={styles.simpleLine}>{p.languages.join(", ")}</Text>
              </View>
            ) : null}

            {/* INTERESTS */}

            {p.interests?.length ? (
              <View style={styles.section}>
                <SectionHeader>Interests</SectionHeader>

                <Text style={styles.simpleLine}>{p.interests.join(", ")}</Text>
              </View>
            ) : null}

            {/* EXTRA SECTIONS */}

            {(p.extraSections || []).map((section, index) => (
              <GenericSection key={index} section={section} />
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}
