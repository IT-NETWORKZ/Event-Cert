import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Event.css";
import { ArrowLeft, Building2, Calendar, CalendarCheck, ChevronLeft, ChevronRight, ClipboardList, Clock, Globe, IndianRupee, Info, MapPin, Phone, Plus, UserPlus, Users, X } from "lucide-react";
import DataTable from "../../common/Table/DataTable";

/* ==========================================================================
   STATIC HELPERS / DATA  (no API)
   ========================================================================== */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const toUri = (svg) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

const fmtDate = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${pad(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};
const fmtTime = (str) => {
  if (!str) return "";
  const [h, m] = str.split(":").map(Number);
  return `${pad(h % 12 === 0 ? 12 : h % 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
const ageFromDob = (dob) => {
  if (!dob) return "";
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return "";
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a -= 1;
  return a >= 0 ? String(a) : "";
};

// default picture by gender when the participant did not add an image
const genderIcon = (gender) => {
  const male = gender === "Male";
  const female = gender === "Female";
  const bg = male ? "#dbeafe" : female ? "#fce7f3" : "#e0f2f1";
  const fg = male ? "#2563eb" : female ? "#db2777" : "#009688";
  const hair = female
    ? `<path d='M27 46c0-17 9-27 21-27s21 10 21 27v10c-4-6-6-14-6-22-8 1-15-2-19-8-2 8-8 14-17 15z' fill='${fg}' opacity='.55'/>`
    : "";
  return toUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' fill='${bg}'/>${hair}<circle cx='48' cy='38' r='15' fill='${fg}'/><path d='M18 96c0-19 13-30 30-30s30 11 30 30z' fill='${fg}'/></svg>`
  );
};
const getProfileImage = (profile, gender) => (profile && profile.trim() ? profile : genderIcon(gender));

// event banner placeholder (teal gradient with the title)
const makeBanner = (title, variant = 0) => {
  const c = variant ? ["#2fa194", "#00796b"] : ["#5fb8ad", "#009688"];
  const words = title.length > 34 ? `${title.slice(0, 32)}...` : title;
  return toUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='520'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c[0]}'/><stop offset='1' stop-color='${c[1]}'/></linearGradient></defs>` +
      `<rect width='800' height='520' fill='url(#g)'/><circle cx='720' cy='60' r='150' fill='white' opacity='.12'/><circle cx='60' cy='480' r='170' fill='white' opacity='.1'/>` +
      `<text x='400' y='270' font-size='40' font-family='Arial' font-weight='700' fill='white' text-anchor='middle'>${words.replace(/&/g, "&amp;")}</text>` +
      `<text x='400' y='318' font-size='22' font-family='Arial' fill='white' opacity='.85' text-anchor='middle'>${variant ? "Event Gallery" : "Event Banner"}</text></svg>`
  );
};

// static QR-like picture (not scannable - demo only)
const makeQr = (seed = 7) => {
  const n = 25;
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  let rects = "";
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      if (!inFinder(x, y) && rnd() > 0.52) rects += `<rect x='${x}' y='${y}' width='1' height='1'/>`;
    }
  }
  const finder = (ox, oy) =>
    `<rect x='${ox}' y='${oy}' width='7' height='7' fill='#111'/><rect x='${ox + 1}' y='${oy + 1}' width='5' height='5' fill='#fff'/><rect x='${ox + 2}' y='${oy + 2}' width='3' height='3' fill='#111'/>`;
  return toUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='-1 -1 ${n + 2} ${n + 2}'><rect x='-1' y='-1' width='${n + 2}' height='${n + 2}' fill='#fff'/><g fill='#111'>${rects}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`
  );
};

// sample event used when the page is opened without an event in state
const defaultEvent = {
  id: 0,
  title: "IT Internship - Network Communication & Security",
  date: "2026-09-01T18:00",
  location: "ITNetworkZ Infosystems Pvt Ltd, Plot 5, RPTS Rd, Laxmi Nagar, Nagpur - 440022.",
  state: "Maharashtra",
  city: "Nagpur",
  description: "Build practical skills in Network Communication & Security with our 6-Week Technical Internship.",
  entry: 3800,
  image: "",
};

const buildEvent = (picked) => {
  const e = { ...defaultEvent, ...(picked || {}) };
  const [datePart, timePart = "10:00"] = String(e.date).split("T");
  return {
    id: e.id,
    title: e.title,
    startDate: datePart,
    endDate: e.endDate || datePart,
    time: timePart.slice(0, 5),
    venue: e.location,
    mode: e.mode || "Offline",
    entry: Number(e.entry) || 0,
    contact: e.contact || "+91 98765 43210",
    org: e.org || "ITNetworkZ Infosystems Pvt Ltd",
    about: e.description,
    instructions: e.instructions || [
      "Carry a valid photo ID card to the venue.",
      "Reach the venue 30 minutes before the start time.",
      "Registration fee once paid is non-refundable.",
      "For any query, call the contact number given above.",
    ],
    images: [e.image || makeBanner(e.title, 0), makeBanner(e.title, 1)],
  };
};

/* participants already registered (static) */
const people = [
  ["Rahul Patil", "Male", "Student", "COEP Pune", ""],
  ["Sneha Joshi", "Female", "Student", "VNIT Nagpur", "Team Alpha"],
  ["Amit Shah", "Male", "Working Professional", "TCS", ""],
  ["Priya Deshmukh", "Female", "Fresher", "IIT Bombay", "Team Alpha"],
  ["Karan Mehta", "Male", "Student", "NIT Trichy", ""],
  ["Anjali Verma", "Female", "Working Professional", "Infosys", "Team Beta"],
  ["Rohan Kulkarni", "Male", "Fresher", "BITS Pilani", "Team Beta"],
  ["Neha Singh", "Female", "Student", "VJTI Mumbai", ""],
];
const statuses = ["Participant", "Winner", "Participant", "Runner-up", "Participant", "Participant", "Participant", "Participant"];
const initialParticipants = people.map(([name, gender, category, college, group], i) => ({
  id: i + 1,
  status: statuses[i],
  groupName: group,
  name,
  gender,
  category,
  college,
  profile: "",
}));

const emptyMember = (id) => ({
  id,
  name: "", gender: "", dob: "", age: "", email: "", mobile: "", address: "",
  profileFile: null,
  category: "Student",
  collegeName: "", stream: "", branch: "", academicYear: "",
  organizationName: "", designation: "", experience: "",
});

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const Event = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const event = useMemo(() => buildEvent(location.state?.event), [location.state]);
  const qrSrc = useMemo(() => makeQr(event.id + 3), [event.id]);

  // gallery
  const [imgIdx, setImgIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");

  // registration form
  const [regType, setRegType] = useState("Individual");
  const [groupName, setGroupName] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [members, setMembers] = useState([emptyMember(1)]);
  const [nextId, setNextId] = useState(2);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [participants, setParticipants] = useState(initialParticipants);

  // new event opened -> start from the first picture / clean form
  useEffect(() => {
    setImgIdx(0);
    window.scrollTo({ top: 0 });
  }, [event.id, params]);

  // keyboard for the fullscreen pictures
  useEffect(() => {
    if (!galleryOpen && !profilePreview) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setGalleryOpen(false);
        setProfilePreview("");
      }
      if (galleryOpen && e.key === "ArrowLeft") changeImage(-1);
      if (galleryOpen && e.key === "ArrowRight") changeImage(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryOpen, profilePreview, imgIdx]);

  const changeImage = (step) =>
    setImgIdx((i) => (i + step + event.images.length) % event.images.length);

  /* ---------------- members ---------------- */
  const updateMember = (id, patch) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const onMemberChange = (id, e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "name") v = value.replace(/[^A-Za-z ]/g, "");
    if (name === "mobile") v = value.replace(/[^0-9]/g, "");
    const patch = { [name]: v };
    if (name === "dob") patch.age = ageFromDob(value);
    updateMember(id, patch);
  };

  const addMember = () => {
    setMembers((p) => [...p, emptyMember(nextId)]);
    setNextId((n) => n + 1);
  };
  const removeMember = () => setMembers((p) => (p.length > 1 ? p.slice(0, -1) : p));

  const chooseType = (type) => {
    setRegType(type);
    if (type === "Individual") setMembers((p) => p.slice(0, 1));
  };

  /* ---------------- Book Now ---------------- */
  const handleBook = (e) => {
    e.preventDefault();
    if (regType === "Group" && !groupName.trim()) {
      setMsg({ type: "error", text: "Please enter the Group Name." });
      return;
    }
    const added = members.map((m, i) => ({
      id: Date.now() + i,
      status: "Participant",
      groupName: regType === "Group" ? groupName.trim() : "",
      name: m.name.trim(),
      gender: m.gender,
      category: m.category,
      college: m.category === "Working Professional" ? m.organizationName : m.collegeName,
      profile: m.profileFile ? URL.createObjectURL(m.profileFile) : "",
    }));
    setParticipants((prev) => [...prev, ...added]);

    const total = event.entry * members.length;
    setMsg({
      type: "ok",
      text: `Thank you! ${members.length} participant${members.length > 1 ? "s" : ""} registered for "${event.title}".` +
        (total ? ` Total fee: ₹ ${total.toFixed(2)}` : " This event is free."),
    });
    setMembers([emptyMember(nextId)]);
    setNextId((n) => n + 1);
    setGroupName("");
    setTeamLead("");
    setRegType("Individual");
    window.scrollTo({ top: document.getElementById("evp-register")?.offsetTop - 20 || 0, behavior: "smooth" });
  };

  /* ---------------- participants table ---------------- */
  const columns = useMemo(
    () => [
      { header: "Sr. No.", id: "srNo", enableSorting: false, meta: { className: "text-center", width: "90px" }, cell: ({ row }) => row.index + 1 },
      {
        header: "Status",
        accessorKey: "status",
        meta: { className: "text-center", width: "140px" },
        cell: (i) => {
          const v = i.getValue();
          const cls = v === "Winner" ? "evp-winner" : v === "Runner-up" ? "evp-runnerup" : "evp-participant";
          return <span className={`evp-status ${cls}`}>{v}</span>;
        },
      },
      { header: "Group Name", accessorKey: "groupName", meta: { className: "text-center", width: "160px" } },
      {
        header: "Profile",
        id: "profile",
        enableSorting: false,
        meta: { className: "text-center", width: "110px" },
        cell: ({ row }) => {
          const src = getProfileImage(row.original.profile, row.original.gender);
          return (
            <img
              src={src}
              alt="Profile"
              className="evp-profile-img"
              title="Click to view"
              onClick={() => setProfilePreview(src)}
            />
          );
        },
      },
      {
        header: "Name",
        accessorKey: "name",
        meta: { className: "text-center", width: "220px" },
        cell: ({ row }) => `${row.original.gender === "Male" ? "Mr." : "Ms."} ${row.original.name}`,
      },
      { header: "College / Fresher / Organization", accessorKey: "college", meta: { className: "text-center", width: "260px" } },
    ],
    []
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="evp-page">
      <div className="evp-container">
        <button type="button" className="evp-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* ===== PAGE HEADING ===== */}
        <div className="evp-heading">
          <h2>Event Registration</h2>
          <p>Register yourself or your team for this event</p>
          <div className="evp-line" />
        </div>

        {/* ===== EVENT HERO ===== */}
        <div className="evp-hero">
          <div className="evp-info">
            <div className="evp-badge">
              <CalendarCheck size={15} /> Event Details
            </div>
            <h2 className="evp-event-title">{event.title}</h2>

            <div className="evp-meta-grid">
              <div className="evp-meta">
                <span className="evp-meta-icon"><Calendar size={18} /></span>
                <div>
                  <span className="evp-meta-label">Event Date</span>
                  <span className="evp-meta-value">
                    {fmtDate(event.startDate)} - {fmtDate(event.endDate)}
                  </span>
                </div>
              </div>
              <div className="evp-meta">
                <span className="evp-meta-icon"><Clock size={18} /></span>
                <div>
                  <span className="evp-meta-label">Time</span>
                  <span className="evp-meta-value">{fmtTime(event.time)}</span>
                </div>
              </div>
              <div className="evp-meta">
                <span className="evp-meta-icon"><MapPin size={18} /></span>
                <div>
                  <span className="evp-meta-label">Venue</span>
                  <span className="evp-meta-value">{event.venue}</span>
                </div>
              </div>
              <div className="evp-meta">
                <span className="evp-meta-icon"><Globe size={18} /></span>
                <div>
                  <span className="evp-meta-label">Mode</span>
                  <span className="evp-meta-value">{event.mode}</span>
                </div>
              </div>
              <div className="evp-meta">
                <span className="evp-meta-icon"><IndianRupee size={18} /></span>
                <div>
                  <span className="evp-meta-label">Entry Fee</span>
                  <span className="evp-meta-value">{event.entry ? `₹ ${event.entry.toFixed(2)}` : "Free"}</span>
                </div>
              </div>
              <div className="evp-meta">
                <span className="evp-meta-icon"><Phone size={18} /></span>
                <div>
                  <span className="evp-meta-label">Contact</span>
                  <span className="evp-meta-value">{event.contact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* gallery */}
          <div className="evp-gallery-area">
            <div className="evp-gallery">
              <button type="button" className="evp-arrow evp-prev" onClick={() => changeImage(-1)} aria-label="Previous image">
                <ChevronLeft size={20} />
              </button>

              <div className="evp-image-box" onClick={() => setGalleryOpen(true)} title="Click to view image">
                <img src={event.images[imgIdx]} alt={event.title} />
              </div>

              <button type="button" className="evp-arrow evp-next" onClick={() => changeImage(1)} aria-label="Next image">
                <ChevronRight size={20} />
              </button>

              <div className="evp-counter">{imgIdx + 1} / {event.images.length}</div>
            </div>
          </div>
        </div>

        {/* ===== REGISTRATION CARD ===== */}
        <div className="evp-reg-card" id="evp-register">
          <div className="evp-reg-header">
            <span className="evp-reg-icon"><UserPlus size={22} /></span>
            <div>
              <h3>Registration Details</h3>
              <span>Enter participant information below</span>
            </div>
          </div>

          <form className="evp-reg-body" onSubmit={handleBook}>
            {msg.text && <div className={`evp-msg ${msg.type}`}>{msg.text}</div>}

            {/* registration type */}
            <div className="evp-type-wrap">
              <label className="evp-field-heading">Registration Type *</label>
              <div className="evp-type">
                <label className={`evp-check ${regType === "Group" ? "on" : ""}`}>
                  <input type="checkbox" checked={regType === "Group"} onChange={() => chooseType("Group")} />
                  <span>Group Registration</span>
                </label>
                <label className={`evp-check ${regType === "Individual" ? "on" : ""}`}>
                  <input type="checkbox" checked={regType === "Individual"} onChange={() => chooseType("Individual")} />
                  <span>Individual Registration</span>
                </label>
              </div>
            </div>

            {/* group name + team lead */}
            {regType === "Group" && (
              <div className="evp-row evp-two">
                <div className="evp-field">
                  <label>Group Name *</label>
                  <input value={groupName} onChange={(e) => setGroupName(e.target.value)} maxLength={100} placeholder="Enter Group Name" />
                </div>
                <div className="evp-field">
                  <label>Team Lead Name</label>
                  <input value={teamLead} onChange={(e) => setTeamLead(e.target.value)} maxLength={100} placeholder="Enter Team Lead Name" />
                </div>
              </div>
            )}

            {/* participant forms */}
            {members.map((m, idx) => (
              <div className="evp-member" key={m.id}>
                {regType === "Group" && <div className="evp-member-title">Participant {idx + 1}</div>}

                <div className="evp-grid evp-g12">
                  <div className="evp-field evp-c5">
                    <label>Full Name *</label>
                    <input name="name" value={m.name} onChange={(e) => onMemberChange(m.id, e)} required maxLength={30} />
                  </div>
                  <div className="evp-field evp-c3">
                    <label>Gender *</label>
                    <select name="gender" value={m.gender} onChange={(e) => onMemberChange(m.id, e)} required>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="evp-field evp-c2">
                    <label>DOB *</label>
                    <input type="date" name="dob" value={m.dob} onChange={(e) => onMemberChange(m.id, e)} required max={new Date().toISOString().slice(0, 10)} />
                  </div>
                  <div className="evp-field evp-c2">
                    <label>Age *</label>
                    <input value={m.age} readOnly placeholder="Auto" />
                  </div>

                  <div className="evp-field evp-c4">
                    <label>Email *</label>
                    <input type="email" name="email" value={m.email} onChange={(e) => onMemberChange(m.id, e)} required maxLength={100} />
                  </div>
                  <div className="evp-field evp-c4">
                    <label>WhatsApp No *</label>
                    <input name="mobile" value={m.mobile} onChange={(e) => onMemberChange(m.id, e)} required inputMode="numeric" pattern="[0-9]{6,20}" title="6 to 20 digits" maxLength={20} />
                  </div>
                  <div className="evp-field evp-c4">
                    <label>Address *</label>
                    <input name="address" value={m.address} onChange={(e) => onMemberChange(m.id, e)} required maxLength={50} />
                  </div>

                  <div className="evp-field evp-c4">
                    <label>Profile Image</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.svg"
                      onChange={(e) => updateMember(m.id, { profileFile: e.target.files[0] || null })}
                    />
                    <small>JPG, JPEG, PNG or SVG only</small>
                  </div>

                  {/* category */}
                  <div className="evp-field evp-c12">
                    <label>Registration Category *</label>
                    <div className="evp-categories">
                      {["Student", "Fresher", "Working Professional"].map((c) => (
                        <label key={c} className={`evp-radio ${m.category === c ? "on" : ""}`}>
                          <input
                            type="radio"
                            name={`category_${m.id}`}
                            checked={m.category === c}
                            onChange={() => updateMember(m.id, { category: c })}
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Student / Fresher */}
                  {m.category !== "Working Professional" && (
                    <>
                      <div className="evp-field evp-c6">
                        <label>College Name *</label>
                        <input name="collegeName" value={m.collegeName} onChange={(e) => onMemberChange(m.id, e)} required maxLength={150} placeholder="Ex: SMT College of Pharma, Nagpur" />
                      </div>
                      <div className="evp-field evp-c6">
                        <label>Stream *</label>
                        <input name="stream" value={m.stream} onChange={(e) => onMemberChange(m.id, e)} required maxLength={100} placeholder={m.category === "Student" ? "Ex: BTECH" : "Ex: B.Pharm"} />
                      </div>
                      <div className="evp-field evp-c6">
                        <label>Branch *</label>
                        <input name="branch" value={m.branch} onChange={(e) => onMemberChange(m.id, e)} required maxLength={100} placeholder="Ex: Computer Science" />
                      </div>
                      <div className="evp-field evp-c6">
                        <label>{m.category === "Student" ? "Academic Year *" : "Passout Year *"}</label>
                        <input name="academicYear" value={m.academicYear} onChange={(e) => onMemberChange(m.id, e)} required maxLength={50} placeholder={m.category === "Student" ? "Ex: 2nd Year" : "Ex: 2021"} />
                      </div>
                    </>
                  )}

                  {/* Working professional */}
                  {m.category === "Working Professional" && (
                    <>
                      <div className="evp-field evp-c4">
                        <label>Organization Name *</label>
                        <input name="organizationName" value={m.organizationName} onChange={(e) => onMemberChange(m.id, e)} required maxLength={150} placeholder="Ex: Abc Pvt. Ltd." />
                      </div>
                      <div className="evp-field evp-c4">
                        <label>Designation *</label>
                        <input name="designation" value={m.designation} onChange={(e) => onMemberChange(m.id, e)} required maxLength={100} placeholder="Ex: Software Engineer" />
                      </div>
                      <div className="evp-field evp-c4">
                        <label>Experience *</label>
                        <input name="experience" value={m.experience} onChange={(e) => onMemberChange(m.id, e)} required maxLength={50} placeholder="Ex: 1.5" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* buttons */}
            <div className="evp-actions">
              <button type="submit" className="evp-book-btn">Book Now</button>

              {regType === "Group" && (
                <div className="evp-member-actions">
                  <button type="button" className="evp-add-btn" title="Add participant" onClick={addMember}>
                    <Plus size={18} />
                  </button>
                  <button type="button" className="evp-remove-btn" title="Remove participant" onClick={removeMember} disabled={members.length === 1}>
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ===== EVENT DESCRIPTION ===== */}
        <div className="evp-desc-card">
          <h4 className="evp-org">
            <Building2 size={22} /> {event.org}
          </h4>

          <div className="evp-two-cards">
            <div className="evp-detail">
              <div className="evp-detail-head">
                <span className="evp-detail-icon"><Info size={19} /></span>
                <div>
                  <h3>About</h3>
                  <span>Event Overview</span>
                </div>
              </div>
              <div className="evp-detail-body">{event.about}</div>
            </div>

            <div className="evp-detail">
              <div className="evp-detail-head">
                <span className="evp-detail-icon alt"><ClipboardList size={19} /></span>
                <div>
                  <h3>Instructions</h3>
                  <span>Important Information</span>
                </div>
              </div>
              <div className="evp-detail-body">
                <ul>
                  {event.instructions.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ===== PAYMENT ===== */}
          <h3 className="evp-payment-title">Payment Details</h3>

          {event.entry === 0 ? (
            <p className="evp-empty">This event is free. No payment is required.</p>
          ) : (
            <>
              {/* UPI */}
              <div className="evp-pay-box">
                <div className="evp-pay-img">
                  <span className="evp-pay-brand">G Pay</span>
                  <small>Payment Mode</small>
                </div>
                <div className="evp-pay-card">
                  <h4>UPI Payment Details</h4>
                  <div className="evp-two">
                    <div className="evp-info-box">
                      <span>UPI ID</span>
                      <strong>itnetworkz@okaxis</strong>
                    </div>
                    <div className="evp-info-box">
                      <span>Mobile No.</span>
                      <strong>98765 43210</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR + bank */}
              <div className="evp-pay-box">
                <div className="evp-pay-img qr">
                  <img src={qrSrc} alt="Scan this QR code for Payment" title="Scan this QR code for Payment" />
                </div>
                <div className="evp-pay-card">
                  <h4>Bank Details</h4>
                  <div className="evp-two">
                    <div className="evp-info-box"><span>Account Holder</span><strong>ITNetworkZ Infosystems Pvt Ltd</strong></div>
                    <div className="evp-info-box"><span>Bank Name</span><strong>State Bank of India</strong></div>
                    <div className="evp-info-box"><span>Address</span><strong>Laxmi Nagar, Nagpur</strong></div>
                    <div className="evp-info-box"><span>IFSC Code</span><strong>SBIN0001234</strong></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== PARTICIPANTS TABLE ===== */}
          <div className="evp-section-title evp-after">
            <Users size={21} /> Participants
            <span>Registered for this event</span>
          </div>
          <div className="evp-table">
            {participants.length ? (
              <DataTable columns={columns} data={participants} centerToolbar />
            ) : (
              <p className="evp-empty">No participants have registered yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== FULLSCREEN EVENT IMAGE ===== */}
      {galleryOpen && (
        <div className="evp-overlay" onClick={() => setGalleryOpen(false)}>
          <button type="button" className="evp-close" onClick={() => setGalleryOpen(false)} aria-label="Close preview">
            <X size={20} />
          </button>
          <button type="button" className="evp-modal-arrow evp-modal-prev" onClick={(e) => { e.stopPropagation(); changeImage(-1); }} aria-label="Previous image">
            <ChevronLeft size={20} />
          </button>
          <img className="evp-full-img" src={event.images[imgIdx]} alt={event.title} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="evp-modal-arrow evp-modal-next" onClick={(e) => { e.stopPropagation(); changeImage(1); }} aria-label="Next image">
            <ChevronRight size={20} />
          </button>
          <div className="evp-modal-counter">{imgIdx + 1} / {event.images.length}</div>
        </div>
      )}

      {/* ===== FULLSCREEN PROFILE IMAGE ===== */}
      {profilePreview && (
        <div className="evp-overlay" onClick={() => setProfilePreview("")}>
          <button type="button" className="evp-close" onClick={() => setProfilePreview("")} aria-label="Close preview">
            <X size={20} />
          </button>
          <img className="evp-full-img profile" src={profilePreview} alt="Profile" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default Event;
