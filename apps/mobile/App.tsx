import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  isProfileComplete,
  navForRole,
  SCHOOL_DEFAULT_NAME,
  toE164India,
  type Chapter,
  type Material,
  type Profile,
  type Question,
  type QuestionPaper,
  type SchoolClass,
  type Subject,
  type UserRole,
  type VideoLecture,
} from "@parasnath/shared";
import {
  fetchChapters,
  fetchClasses,
  fetchMaterials,
  fetchProfile,
  fetchQuestions,
  fetchQuestionPapers,
  fetchStudents,
  fetchSubjectIds,
  fetchSubjects,
  fetchUsers,
  fetchVideoLectures,
  saveProfile,
  updateRole,
} from "./lib/api";
import { hasSupabaseConfig, supabase } from "./lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type Screen =
  | "hub"
  | "email"
  | "phone"
  | "profile"
  | "home"
  | "students"
  | "users"
  | "notes"
  | "tests"
  | "videos"
  | "questions"
  | "papers"
  | "faq"
  | "privacy"
  | "soon";

export default function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [screen, setScreen] = useState<Screen>("hub");
  const [soonTitle, setSoonTitle] = useState("Coming soon");
  const [error, setError] = useState<string | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setProfile(null);
        setScreen("hub");
        setReady(true);
        return;
      }
      const p = await fetchProfile();
      setProfile(p);
      setScreen(isProfileComplete(p) ? "home" : "profile");
    } catch {
      setProfile(null);
      setScreen("hub");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setError("Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to apps/mobile/.env");
      setReady(true);
      return;
    }
    // Safety timeout: ensure ready is set within 2s even if network is slow
    const timer = setTimeout(() => setReady(true), 2000);
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [refresh]);

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#165b46" />
        <Text style={[styles.muted, { marginTop: 12, fontWeight: "600" }]}>
          Loading Parasnath Learning...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {error ? <Text style={styles.banner}>{error}</Text> : null}

      {/* Global Student Crisis Modal */}
      <CrisisModal visible={showCrisis} onClose={() => setShowCrisis(false)} />

      {screen === "hub" ? (
        <AuthHub
          onEmail={() => setScreen("email")}
          onPhone={() => setScreen("phone")}
          onFaq={() => setScreen("faq")}
          onPrivacy={() => setScreen("privacy")}
          onCrisis={() => setShowCrisis(true)}
          onError={setError}
        />
      ) : null}

      {screen === "email" ? (
        <EmailAuth onBack={() => setScreen("hub")} onError={setError} />
      ) : null}

      {screen === "phone" ? (
        <PhoneAuth onBack={() => setScreen("hub")} onError={setError} />
      ) : null}

      {screen === "profile" && profile ? (
        <ProfileScreen profile={profile} onError={setError} onSaved={refresh} />
      ) : null}

      {screen === "home" && profile ? (
        <HomeScreen
          profile={profile}
          onCrisis={() => setShowCrisis(true)}
          onFaq={() => setScreen("faq")}
          onPrivacy={() => setScreen("privacy")}
          onOpen={(item) => {
            if (item.href === "/app") return;
            if (item.href === "/app/profile") {
              setScreen("profile");
              return;
            }
            if (item.href === "/app/students") {
              setScreen("students");
              return;
            }
            if (item.href === "/app/admin/users") {
              setScreen("users");
              return;
            }
            if (item.href === "/app/notes") {
              setScreen("notes");
              return;
            }
            if (item.href === "/app/tests" || item.href === "/app/study") {
              setScreen("tests");
              return;
            }
            if (item.href === "/app/videos") {
              setScreen("videos");
              return;
            }
            if (item.href === "/app/questions") {
              setScreen("questions");
              return;
            }
            if (item.href === "/app/papers") {
              setScreen("papers");
              return;
            }
            setSoonTitle(item.label);
            setScreen("soon");
          }}
          onSignOut={async () => {
            await supabase.auth.signOut();
          }}
        />
      ) : null}

      {screen === "notes" ? (
        <NotesMobileScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "tests" ? (
        <TestsMobileScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "videos" ? (
        <VideosMobileScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "questions" ? (
        <QuestionsMobileScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "papers" ? (
        <PapersMobileScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "students" ? (
        <StudentsScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "users" ? (
        <UsersScreen onBack={() => setScreen("home")} />
      ) : null}

      {screen === "faq" ? (
        <FaqScreen onBack={() => setScreen(profile ? "home" : "hub")} />
      ) : null}

      {screen === "privacy" ? (
        <PrivacyScreen onBack={() => setScreen(profile ? "home" : "hub")} />
      ) : null}

      {screen === "soon" ? (
        <SoonScreen title={soonTitle} onBack={() => setScreen("home")} />
      ) : null}
    </View>
  );
}

function CrisisModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  function callNumber(num: string) {
    void Linking.openURL(`tel:${num}`);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.kicker}>STUDENT WELLBEING SUPPORT</Text>
          <Text style={styles.h2}>You Are Not Alone</Text>
          <Text style={styles.muted}>
            If you are feeling overwhelmed, anxious, or facing distress, confidential 24/7 help is completely free:
          </Text>

          <Pressable style={styles.helplineBox} onPress={() => callNumber("14416")}>
            <Text style={styles.helplineTitle}>Tele-MANAS (Govt 24/7)</Text>
            <Text style={styles.helplinePhone}>Call 14416</Text>
          </Pressable>

          <Pressable style={styles.helplineBox} onPress={() => callNumber("18005990019")}>
            <Text style={styles.helplineTitle}>KIRAN Mental Health</Text>
            <Text style={styles.helplinePhone}>1800-599-0019</Text>
          </Pressable>

          <Pressable style={styles.helplineBox} onPress={() => callNumber("1098")}>
            <Text style={styles.helplineTitle}>Childline (Students)</Text>
            <Text style={styles.helplinePhone}>Call 1098</Text>
          </Pressable>

          <Pressable style={[styles.btn, { marginTop: 16 }]} onPress={onClose}>
            <Text style={styles.btnText}>Back to Learning</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function AuthHub({
  onEmail,
  onPhone,
  onFaq,
  onPrivacy,
  onCrisis,
  onError,
}: {
  onEmail: () => void;
  onPhone: () => void;
  onFaq: () => void;
  onPrivacy: () => void;
  onCrisis: () => void;
  onError: (m: string | null) => void;
}) {
  async function google() {
    onError(null);
    try {
      const redirectTo = Linking.createURL("auth/callback");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error || !data.url) {
        onError(error?.message ?? "Google sign-in failed");
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const code = parsed.queryParams?.code;
        const codeStr = Array.isArray(code) ? code[0] : code;
        if (codeStr) {
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(codeStr);
          if (exErr) onError(exErr.message);
        } else if (parsed.queryParams?.access_token && parsed.queryParams?.refresh_token) {
          const accessToken = Array.isArray(parsed.queryParams.access_token)
            ? parsed.queryParams.access_token[0]
            : parsed.queryParams.access_token;
          const refreshToken = Array.isArray(parsed.queryParams.refresh_token)
            ? parsed.queryParams.refresh_token[0]
            : parsed.queryParams.refresh_token;
          const { error: setErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setErr) onError(setErr.message);
        }
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : "Google OAuth session failed");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <View style={styles.slaBadge}>
        <Text style={styles.slaText}>⚡ SLA Promise: &lt;100ms response time</Text>
      </View>
      <Text style={styles.kicker}>PARASNATH SCHOOL LEARNING</Text>
      <Text style={styles.h1}>Classes 9 &amp; 10</Text>
      <Text style={styles.muted}>
        NCERT topics, competency micro-tests, handwritten uploads, and AI mind-maps.
      </Text>

      <Pressable style={styles.btnLight} onPress={google}>
        <Text style={styles.btnLightText}>Continue with Google</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onEmail}>
        <Text style={styles.btnText}>Continue with Email</Text>
      </Pressable>
      <Pressable style={styles.btnGhost} onPress={onPhone}>
        <Text style={styles.btnGhostText}>Continue with Phone OTP</Text>
      </Pressable>

      <View style={styles.rowBetween}>
        <Pressable onPress={onFaq}>
          <Text style={styles.linkSmall}>5 FAQs</Text>
        </Pressable>
        <Pressable onPress={onPrivacy}>
          <Text style={styles.linkSmall}>Privacy &amp; Terms</Text>
        </Pressable>
        <Pressable onPress={onCrisis}>
          <Text style={[styles.linkSmall, { color: "#b45309" }]}>Support &amp; Wellbeing</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function EmailAuth({
  onBack,
  onError,
}: {
  onBack: () => void;
  onError: (m: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function validate() {
    setFieldError(null);
    if (!email.trim() || !email.includes("@")) {
      setFieldError("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      setFieldError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }

  async function submit() {
    if (!validate()) return;
    onError(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) onError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) onError(error.message);
      else {
        Alert.alert("Account Created", "You can now sign in and complete your details.");
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to sign-in options</Text>
      </Pressable>
      <Text style={styles.h1}>{mode === "in" ? "Email Sign In" : "Create Account"}</Text>
      {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="student@school.edu"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        secureTextEntry
        placeholder="Password (min 6 chars)"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>{mode === "in" ? "Sign In" : "Register"}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === "in" ? "up" : "in")}>
        <Text style={styles.link}>
          {mode === "in" ? "Need an account? Register" : "Have an account? Sign In"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function PhoneAuth({
  onBack,
  onError,
}: {
  onBack: () => void;
  onError: (m: string | null) => void;
}) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  function validatePhone() {
    setFieldError(null);
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setFieldError("Please enter a valid 10-digit Indian phone number");
      return false;
    }
    return true;
  }

  async function send() {
    if (!validatePhone()) return;
    onError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: toE164India(phone) });
    if (error) onError(error.message);
    else setSent(true);
  }

  async function verify() {
    if (!otp.trim()) {
      setFieldError("Please enter the received OTP");
      return;
    }
    onError(null);
    const { error } = await supabase.auth.verifyOtp({
      phone: toE164India(phone),
      token: otp.trim(),
      type: "sms",
    });
    if (error) onError(error.message);
  }

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to sign-in options</Text>
      </Pressable>
      <Text style={styles.h1}>Phone OTP</Text>
      <Text style={styles.muted}>Fast passwordless sign in via SMS.</Text>
      {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}

      <TextInput
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="10-digit number (e.g. 9876543210)"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />
      {sent ? (
        <>
          <TextInput
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            style={[styles.input, { letterSpacing: 4, textAlign: "center", fontSize: 18 }]}
            value={otp}
            onChangeText={setOtp}
          />
          <Pressable style={styles.btn} onPress={verify}>
            <Text style={styles.btnText}>Verify &amp; Enter</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.btn} onPress={send}>
          <Text style={styles.btnText}>Send SMS OTP</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function ProfileScreen({
  profile,
  onError,
  onSaved,
}: {
  profile: Profile;
  onError: (m: string | null) => void;
  onSaved: () => Promise<void>;
}) {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone?.replace(/^\+91/, "") ?? "");
  const [classId, setClassId] = useState(profile.class_id ?? "");
  const [section, setSection] = useState(profile.section ?? "");
  const [schoolName, setSchoolName] = useState(profile.school_name ?? SCHOOL_DEFAULT_NAME);
  const [roll, setRoll] = useState(profile.roll_number ?? "");
  const [picked, setPicked] = useState<string[]>([]);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [c, s, ids] = await Promise.all([
        fetchClasses(),
        fetchSubjects(),
        fetchSubjectIds(profile.id),
      ]);
      setClasses(c);
      setSubjects(s);
      setPicked(ids);
      setClassId((current) => current || c[0]?.id || "");
    })();
  }, [profile.id]);

  function validate() {
    setFieldError(null);
    if (!fullName.trim()) {
      setFieldError("Please enter your full name");
      return false;
    }
    if (phone.replace(/\D/g, "").length !== 10) {
      setFieldError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!section.trim()) {
      setFieldError("Please enter your section (e.g. A, B)");
      return false;
    }
    if (!schoolName.trim()) {
      setFieldError("Please enter your school name");
      return false;
    }
    return true;
  }

  async function save() {
    if (!validate()) return;
    onError(null);
    try {
      await saveProfile({
        id: profile.id,
        full_name: fullName.trim(),
        phone: toE164India(phone),
        class_id: classId,
        section: section.trim().toUpperCase(),
        school_name: schoolName.trim(),
        roll_number: roll.trim(),
        email: profile.email,
        subjectIds: picked,
      });
      await onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Could not save");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Text style={styles.kicker}>ACADEMIC PROFILE</Text>
      <Text style={styles.h1}>Your Details</Text>
      <Text style={styles.muted}>Used for class rosters and NCERT learning assignments.</Text>
      {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}

      <TextInput placeholder="Full name" style={styles.input} value={fullName} onChangeText={setFullName} />
      <TextInput
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="10-digit Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />
      <Text style={styles.label}>Class / Grade</Text>
      <View style={styles.rowWrap}>
        {classes.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setClassId(c.id)}
            style={[styles.chip, classId === c.id && styles.chipOn]}
          >
            <Text style={classId === c.id ? styles.chipOnText : styles.chipText}>{c.name}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput placeholder="Section (e.g. A)" style={styles.input} value={section} onChangeText={setSection} />
      <TextInput placeholder="School Name" style={styles.input} value={schoolName} onChangeText={setSchoolName} />
      <TextInput placeholder="Roll Number (optional)" style={styles.input} value={roll} onChangeText={setRoll} />

      <Text style={styles.label}>Enrolled Subjects</Text>
      <View style={styles.rowWrap}>
        {subjects.map((s) => {
          const on = picked.includes(s.id);
          return (
            <Pressable
              key={s.id}
              onPress={() =>
                setPicked((prev) =>
                  prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                )
              }
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={on ? styles.chipOnText : styles.chipText}>
                {on ? "✓ " : "+ "}
                {s.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Save Details</Text>
      </Pressable>
    </ScrollView>
  );
}

function HomeScreen({
  profile,
  onOpen,
  onSignOut,
  onCrisis,
  onFaq,
  onPrivacy,
}: {
  profile: Profile;
  onOpen: (item: { href: string; label: string; comingSoon?: boolean }) => void;
  onSignOut: () => void;
  onCrisis: () => void;
  onFaq: () => void;
  onPrivacy: () => void;
}) {
  const nav = navForRole(profile.role);
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <View style={styles.slaBadge}>
        <Text style={styles.slaText}>⚡ Sub-100ms fast edge response</Text>
      </View>
      <Text style={styles.kicker}>{profile.role.toUpperCase()} WORKSPACE</Text>
      <Text style={styles.h1}>Hello, {profile.full_name}</Text>
      <Text style={styles.muted}>
        {profile.school_name} · Section {profile.section || "A"}
      </Text>

      {/* Mental health bar */}
      <Pressable style={styles.crisisCard} onPress={onCrisis}>
        <Text style={styles.crisisTitle}>Student Wellbeing Support</Text>
        <Text style={styles.crisisSubtitle}>Free 24/7 confidential helplines (Tele-MANAS, KIRAN) →</Text>
      </Pressable>

      <Text style={[styles.label, { marginTop: 18, marginBottom: 8 }]}>Learning Rooms &amp; Modules</Text>
      {nav.map((item) => (
        <Pressable key={item.href} style={styles.card} onPress={() => onOpen(item)}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.cardTitle}>{item.label}</Text>
            {item.comingSoon ? <Text style={styles.soon}>SOON</Text> : null}
          </View>
        </Pressable>
      ))}

      <View style={[styles.rowBetween, { marginTop: 24 }]}>
        <Pressable onPress={onFaq}>
          <Text style={styles.linkSmall}>5 FAQs</Text>
        </Pressable>
        <Pressable onPress={onPrivacy}>
          <Text style={styles.linkSmall}>Privacy Policy</Text>
        </Pressable>
        <Pressable onPress={onSignOut}>
          <Text style={[styles.linkSmall, { color: "#991b1b" }]}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function NotesMobileScreen({ onBack }: { onBack: () => void }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  useEffect(() => {
    void fetchMaterials().then(setMaterials);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.kicker}>TEACHER REVISION NOTES</Text>
      <Text style={styles.h1}>Chapter Handouts</Text>
      {materials.map((m) => (
        <View key={m.id} style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.cardTitle}>{m.title}</Text>
            {m.is_important && <Text style={{ color: "#b45309", fontSize: 11, fontWeight: "bold" }}>⭐ High-Yield</Text>}
          </View>
          <Text style={[styles.muted, { marginTop: 4 }]}>{m.description}</Text>
          <Pressable
            style={[styles.btnLight, { marginTop: 8 }]}
            onPress={() => Linking.openURL(m.file_url)}
          >
            <Text style={styles.btnLightText}>📄 Open PDF Notes</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

function TestsMobileScreen({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void fetchQuestions().then((data) => setQuestions(data.filter((q) => q.is_pyq)));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.kicker}>CBSE BOARD REPOSITORY</Text>
      <Text style={styles.h1}>Previous-Year PYQs</Text>
      {questions.map((q, idx) => {
        const isRev = revealed[q.id];
        return (
          <View key={q.id} style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#6b21a8" }}>CBSE {q.pyq_year}</Text>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#165b46" }}>{q.marks} Mark</Text>
            </View>
            <Text style={[styles.cardTitle, { marginTop: 4 }]}>{idx + 1}. {q.question_text}</Text>
            {q.options?.map((opt) => (
              <Text key={opt.id} style={[styles.muted, { marginTop: 2 }]}>
                {opt.id}. {opt.text}
              </Text>
            ))}
            <Pressable
              style={[styles.chip, { alignSelf: "flex-start", marginTop: 8 }]}
              onPress={() => setRevealed((p) => ({ ...p, [q.id]: !p[q.id] }))}
            >
              <Text style={styles.chipText}>{isRev ? "Hide Marking Key" : "Reveal CBSE Answer Key"}</Text>
            </Pressable>
            {isRev && (
              <View style={{ backgroundColor: "#f0fdf4", padding: 10, borderRadius: 10, marginTop: 8 }}>
                <Text style={{ fontWeight: "bold", color: "#166534", fontSize: 12 }}>Key: {q.correct_answer}</Text>
                <Text style={{ color: "#15803d", fontSize: 11, marginTop: 2 }}>{q.explanation}</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function VideosMobileScreen({ onBack }: { onBack: () => void }) {
  const [videos, setVideos] = useState<VideoLecture[]>([]);
  useEffect(() => {
    void fetchVideoLectures().then(setVideos);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.kicker}>VIDEO MASTERCLASSES</Text>
      <Text style={styles.h1}>Topic Lectures</Text>
      {videos.map((v) => (
        <View key={v.id} style={styles.card}>
          <Text style={styles.cardTitle}>{v.title}</Text>
          <Text style={[styles.muted, { marginTop: 4 }]}>{v.description}</Text>
          <Pressable
            style={styles.btn}
            onPress={() => Linking.openURL(v.video_url)}
          >
            <Text style={styles.btnText}>▶ Watch Masterclass</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

function QuestionsMobileScreen({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  useEffect(() => {
    void fetchQuestions().then(setQuestions);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.kicker}>TEACHER BANK</Text>
      <Text style={styles.h1}>All Questions ({questions.length})</Text>
      {questions.map((q, idx) => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.cardTitle}>{idx + 1}. {q.question_text}</Text>
          <Text style={[styles.muted, { marginTop: 2 }]}>
            Format: {q.question_type} · Marks: {q.marks} · Key: {q.correct_answer}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function PapersMobileScreen({ onBack }: { onBack: () => void }) {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [activePaper, setActivePaper] = useState<QuestionPaper | null>(null);

  useEffect(() => {
    void fetchQuestionPapers().then(setPapers);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.kicker}>EXAM BLUEPRINTS &amp; PAPERS</Text>
      <Text style={styles.h1}>Question Papers ({papers.length})</Text>
      {papers.map((p) => (
        <View key={p.id} style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: "#165b46" }}>{p.max_marks} Marks</Text>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: "#6b21a8" }}>{Math.floor(p.time_allowed_minutes / 60)} Hours</Text>
          </View>
          <Text style={[styles.cardTitle, { marginTop: 4 }]}>{p.title}</Text>
          <Text style={[styles.muted, { marginTop: 2 }]}>
            {p.school_name} · {p.sections.length} Sections
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => setActivePaper(activePaper?.id === p.id ? null : p)}
          >
            <Text style={styles.btnText}>{activePaper?.id === p.id ? "Hide Paper" : "View Examination Paper"}</Text>
          </Pressable>
          {activePaper?.id === p.id && (
            <View style={{ marginTop: 12, borderTopWidth: 1, borderColor: "#e5e7eb", paddingTop: 8 }}>
              {p.sections.map((sec) => (
                <View key={sec.id} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 12, color: "#0d382b" }}>{sec.name}</Text>
                  {sec.questions.map((q, idx) => (
                    <Text key={q.id} style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>
                      {idx + 1}. {q.question_text} [{q.marks}M]
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function SoonScreen({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Workspace</Text>
      </Pressable>
      <Text style={styles.soon}>COMING IN BUILD 2</Text>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.muted}>
        This room is part of the complete NCERT 7-step learning cycle: Study → Micro-Test → Written Scan → AI Mind-Map → Teacher Verify → Revise.
      </Text>
    </ScrollView>
  );
}

function FaqScreen({ onBack }: { onBack: () => void }) {
  const faqs = [
    {
      q: "1. What classes and subjects are covered?",
      a: "NCERT Class 9 and 10 Social Science, Science, Math, English, and Hindi, designed for all K-12 expansions.",
    },
    {
      q: "2. How do topic micro-tests work?",
      a: "After completing each sub-topic, students take competency-based MCQs and Assertion-Reason tests with instant scores.",
    },
    {
      q: "3. Can I upload handwritten answers?",
      a: "Yes! Write in your notebook, take a photo or scan PDF to upload for teacher red-pen grading and AI pre-checks.",
    },
    {
      q: "4. What does the AI Assistant do?",
      a: "Simplifies hard concepts, generates educational mind-maps and timelines, and provides safety-filtered guidance.",
    },
    {
      q: "5. How is student privacy protected?",
      a: "Strict DPDP Act & COPPA compliance, encrypted data storage, and zero advertising or tracking cookies.",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back</Text>
      </Pressable>
      <Text style={styles.kicker}>HELP &amp; INFORMATION</Text>
      <Text style={styles.h1}>5 FAQs</Text>
      {faqs.map((f, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{f.q}</Text>
          <Text style={[styles.muted, { marginTop: 4 }]}>{f.a}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function PrivacyScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back</Text>
      </Pressable>
      <Text style={styles.kicker}>COMPLIANCE &amp; SAFETY</Text>
      <Text style={styles.h1}>Privacy &amp; Terms</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Student Privacy Guarantee</Text>
        <Text style={[styles.muted, { marginTop: 6 }]}>
          Parasnath Learning adheres strictly to the India Digital Personal Data Protection (DPDP) Act. We collect only necessary academic records (name, grade, section, test scores) and never sell minor data or display ads.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Honor Code</Text>
        <Text style={[styles.muted, { marginTop: 6 }]}>
          Written test uploads must represent authentic student work. Respectful educational conduct is mandatory across all modules.
        </Text>
      </View>
    </ScrollView>
  );
}

function StudentsScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<
    { full_name: string | null; phone: string | null; section: string | null; school_name: string | null }[]
  >([]);
  useEffect(() => {
    void fetchStudents().then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.h1}>Enrolled Students ({rows.length})</Text>
      {rows.map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{r.full_name ?? "—"}</Text>
          <Text style={styles.muted}>
            Section {r.section ?? "A"} · {r.phone ?? ""} · {r.school_name ?? ""}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function UsersScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<
    { id: string; full_name: string | null; email: string | null; role: string }[]
  >([]);
  useEffect(() => {
    void fetchUsers()
      .then((data) => setRows(data as typeof rows))
      .catch(() => setRows([]));
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Pressable onPress={onBack}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
      <Text style={styles.h1}>User Role Manager</Text>
      {rows.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.cardTitle}>{r.full_name ?? r.email ?? r.id}</Text>
          <View style={styles.rowWrap}>
            {(["student", "teacher", "admin"] as UserRole[]).map((role) => (
              <Pressable
                key={role}
                style={[styles.chip, r.role === role && styles.chipOn]}
                onPress={async () => {
                  await updateRole(r.id, role);
                  setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, role } : x)));
                }}
              >
                <Text style={r.role === role ? styles.chipOnText : styles.chipText}>{role}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fbf9f4" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fbf9f4", padding: 20 },
  pad: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 48 },
  kicker: { color: "#165b46", fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  h1: { fontSize: 26, fontWeight: "800", color: "#0d382b", marginTop: 6, marginBottom: 8 },
  h2: { fontSize: 20, fontWeight: "700", color: "#0d382b", marginTop: 4, marginBottom: 8 },
  muted: { color: "#384f45", marginBottom: 14, lineHeight: 20, fontSize: 13 },
  banner: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: 12,
    marginTop: 48,
    marginHorizontal: 16,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: { color: "#b91c1c", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  slaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e8f3ef",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#165b4633",
  },
  slaText: { fontSize: 10, fontWeight: "700", color: "#165b46" },
  crisisCard: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  crisisTitle: { fontSize: 13, fontWeight: "700", color: "#92400e" },
  crisisSubtitle: { fontSize: 11, color: "#b45309", marginTop: 2 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
  modalCard: { backgroundColor: "#ffffff", borderRadius: 24, padding: 22, shadowOpacity: 0.25 },
  helplineBox: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helplineTitle: { fontSize: 12, fontWeight: "700", color: "#166534" },
  helplinePhone: { fontSize: 12, fontWeight: "800", color: "#15803d" },
  btn: {
    backgroundColor: "#165b46",
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "white", fontWeight: "700", fontSize: 14 },
  btnLight: {
    backgroundColor: "white",
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#ded8cb",
  },
  btnLightText: { fontWeight: "700", color: "#0d382b", fontSize: 14 },
  btnGhost: {
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#165b4655",
    backgroundColor: "#ffffff",
  },
  btnGhostText: { fontWeight: "700", color: "#165b46", fontSize: 14 },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ded8cb",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    fontSize: 14,
    color: "#11261f",
  },
  link: { color: "#165b46", fontWeight: "700", fontSize: 13, marginTop: 10 },
  linkSmall: { color: "#165b46", fontWeight: "700", fontSize: 12 },
  label: { marginTop: 12, fontWeight: "700", color: "#0d382b", fontSize: 13 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ded8cb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
  },
  chipOn: { backgroundColor: "#165b46", borderColor: "#165b46" },
  chipText: { color: "#0d382b", fontSize: 12, fontWeight: "600" },
  chipOnText: { color: "white", fontSize: 12, fontWeight: "600" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ded8cb",
  },
  cardTitle: { fontWeight: "700", color: "#0d382b", fontSize: 14 },
  soon: { color: "#926914", fontWeight: "800", fontSize: 10, letterSpacing: 1 },
});
