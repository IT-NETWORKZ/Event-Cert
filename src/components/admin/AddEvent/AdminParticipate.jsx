import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./AdminParticipate.css";
import DataTable from "../../common/Table/DataTable";

/* ==========================================================================
   STATIC DATA (no API)
   ========================================================================== */
const pad = (n) => String(n).padStart(2, "0");

// 2026-08-10 -> 10/08/2026
const fmtDate = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y}`;
};

const toDataUri = (svg) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

// stands in for a photo the user uploaded themselves (static demo only)
const makePhoto = (name = "P") =>
  toDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='#5fb8ad'/><stop offset='1' stop-color='#009688'/></linearGradient></defs>` +
      `<rect width='96' height='96' fill='url(#g)'/>` +
      `<text x='48' y='62' font-size='44' font-family='Arial' font-weight='700' fill='white' text-anchor='middle'>` +
      `${(name.trim()[0] || "P").toUpperCase()}</text></svg>`
  );

// default icon when the user did NOT add a profile image -> by gender
const genderIcon = (gender) => {
  const male = gender === "Male";
  const female = gender === "Female";
  const bg = male ? "#dbeafe" : female ? "#fce7f3" : "#e0f2f1";
  const fg = male ? "#2563eb" : female ? "#db2777" : "#009688";
  const hair = female
    ? `<path d='M27 46c0-17 9-27 21-27s21 10 21 27v10c-4-6-6-14-6-22-8 1-15-2-19-8-2 8-8 14-17 15z' fill='${fg}' opacity='.55'/>`
    : "";
  return toDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>` +
      `<rect width='96' height='96' fill='${bg}'/>` +
      hair +
      `<circle cx='48' cy='38' r='15' fill='${fg}'/>` +
      `<path d='M18 96c0-19 13-30 30-30s30 11 30 30z' fill='${fg}'/>` +
      `</svg>`
  );
};

// own photo if there is one, otherwise the male / female icon
const getProfileImage = (profile, gender) => (profile && profile.trim() ? profile : genderIcon(gender));

const people = [
  ["Rahul Patil", "Male", "Student"],
  ["Sneha Joshi", "Female", "Student"],
  ["Amit Shah", "Male", "Working Professional"],
  ["Priya Deshmukh", "Female", "Fresher"],
  ["Karan Mehta", "Male", "Student"],
  ["Anjali Verma", "Female", "Working Professional"],
  ["Rohan Kulkarni", "Male", "Fresher"],
  ["Neha Singh", "Female", "Student"],
  ["Vikram Rao", "Male", "Working Professional"],
  ["Pooja Nair", "Female", "Student"],
  ["Sahil Khan", "Male", "Fresher"],
  ["Divya Iyer", "Female", "Student"],
  ["Manish Gupta", "Male", "Working Professional"],
  ["Kavya Reddy", "Female", "Fresher"],
  ["Arjun Bhatt", "Male", "Student"],
  ["Ritu Sharma", "Female", "Working Professional"],
];
const colleges = ["COEP Pune", "VNIT Nagpur", "IIT Bombay", "NIT Trichy", "BITS Pilani", "VJTI Mumbai"];
const streams = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil"];
const orgs = ["TCS", "Infosys", "Wipro", "IT-Networkz", "Persistent Systems", "Accenture"];
const desigs = ["Software Engineer", "Analyst", "Team Lead", "QA Engineer", "Designer"];
const venues = ["Main Auditorium", "Seminar Hall A", "Conference Room 2"];
const statuses = ["Participant", "Winner", "Runner-up", "Participant", "Participant"];

const initialParticipants = people.map(([name, gender, category], i) => {
  const isPro = category === "Working Professional";
  const isFresher = category === "Fresher";
  const dobYear = isPro ? 1990 + (i % 6) : 2000 + (i % 5);
  return {
    id: 1001 + i,
    regDate: `2026-08-${pad(1 + (i % 9))}`,
    status: statuses[i % statuses.length],
    groupName: i % 3 === 0 ? `Team ${String.fromCharCode(65 + (i % 4))}` : "",
    name,
    gender,
    dob: `${dobYear}-${pad(1 + (i % 12))}-${pad(5 + (i % 20))}`,
    age: 2026 - dobYear,
    email: `${name.split(" ")[0].toLowerCase()}${i + 1}@gmail.com`,
    mobile: `98${String(76543210 + i * 1111).slice(0, 8)}`,
    venue: venues[i % venues.length],
    startDay: `Day ${1 + (i % 2)}`,
    stream: isPro ? "" : streams[i % streams.length],
    branch: isPro ? "" : streams[(i + 1) % streams.length],
    year: isPro ? "" : String(2024 + (i % 3)),
    teamLead: i % 3 === 0 ? people[(i + 1) % people.length][0] : "",
    category,
    collegeName: isPro ? "" : colleges[i % colleges.length],
    organizationName: isPro ? orgs[i % orgs.length] : "",
    designation: isPro ? desigs[i % desigs.length] : "",
    experience: isPro ? `${1 + (i % 6)}.5 yrs` : "",
    college1: isFresher ? colleges[(i + 2) % colleges.length] : "",
    stream1: isFresher ? streams[(i + 2) % streams.length] : "",
    year1: isFresher ? String(2025 + (i % 2)) : "",
    address: `${12 + i}, MG Road, ${["Pune", "Mumbai", "Nagpur", "Nashik"][i % 4]}`,
    profile: i % 3 === 0 ? makePhoto(name) : "", // "" = no image added
  };
});

const emptyEdit = {
  id: null, name: "", groupName: "", gender: "", dob: "", age: "", category: "",
  email: "", mobile: "", collegeName: "", stream: "", year: "",
  organizationName: "", designation: "", experience: "", teamLead: "",
  venue: "", startDay: "", status: "Participant", useGroup: false,
};

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const AdminParticipate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const eventId = params.get("nID");
  const eventTitle = location.state?.eventTitle;

  const [rows, setRows] = useState(initialParticipants);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sendId, setSendId] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [edit, setEdit] = useState(null); // null = modal closed

  // message disappears by itself
  useEffect(() => {
    if (!msg.text) return undefined;
    const t = setTimeout(() => setMsg({ type: "", text: "" }), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  // close modal with Esc
  useEffect(() => {
    if (!edit) return undefined;
    const onKey = (e) => e.key === "Escape" && setEdit(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [edit]);

  const toggleOne = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  /* ---------------- columns ---------------- */
  const columns = useMemo(() => {
    const center = "text-center";
    const col = (header, accessorKey, width, extra = {}) => ({
      header,
      accessorKey,
      meta: { className: center, width: `${width}px` },
      ...extra,
    });

    return [
      {
        id: "select",
        enableSorting: false,
        meta: { className: center, width: "130px" },
        header: ({ table }) => {
          const ids = table.getRowModel().rows.map((r) => r.original.id);
          const all = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
          return (
            <label className="ap-select-all" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={all}
                onChange={(e) =>
                  setSelectedIds((prev) =>
                    e.target.checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id))
                  )
                }
              />
              Select All
            </label>
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="ap-check"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleOne(row.original.id)}
          />
        ),
      },
      { header: "Sr. No.", id: "srNo", enableSorting: false, meta: { className: center, width: "80px" }, cell: ({ row }) => row.index + 1 },
      col("Registered Date", "regDate", 140, { cell: (i) => fmtDate(i.getValue()) }),
      col("Status", "status", 130, {
        cell: (i) => {
          const v = i.getValue();
          const cls = v === "Winner" ? "status-winner" : v === "Runner-up" ? "status-runnerup" : "status-participant";
          return <span className={`status-badge ${cls}`}>{v}</span>;
        },
      }),
      col("Group Name", "groupName", 150),
      {
        header: "Profile",
        id: "profile",
        enableSorting: false,
        meta: { className: center, width: "100px" },
        cell: ({ row }) => (
          <img
            src={getProfileImage(row.original.profile, row.original.gender)}
            alt="Profile"
            className="participant-profile-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = genderIcon(row.original.gender);
            }}
          />
        ),
      },
      col("Name", "name", 180, { cell: ({ row }) => `${row.original.gender === "Male" ? "Mr." : "Ms."} ${row.original.name}` }),
      col("Gender", "gender", 100),
      col("DOB", "dob", 120, { cell: (i) => fmtDate(i.getValue()) }),
      col("Age", "age", 80),
      col("Email Id", "email", 240),
      col("Mobile No.", "mobile", 140),
      col("Venue", "venue", 180),
      col("Start Day", "startDay", 120),
      col("Stream", "stream", 170),
      col("Branch", "branch", 170),
      col("Year", "year", 90),
      col("Team Lead", "teamLead", 160),
      col("Category", "category", 190),
      col("College Name", "collegeName", 180),
      col("Organization Name", "organizationName", 180),
      col("Designation", "designation", 170),
      col("Experience", "experience", 120),
      col("College Name (Fresher)", "college1", 200),
      col("Stream (Fresher)", "stream1", 170),
      col("Passout Year", "year1", 120),
      col("Address", "address", 240),
      {
        header: "Edit",
        id: "edit",
        enableSorting: false,
        meta: { className: center, width: "110px" },
        cell: ({ row }) => (
          <button type="button" className="btn btn-sm btn-primary ap-edit-btn" onClick={() => openEdit(row.original)}>
            <i className="fa fa-edit" /> Edit
          </button>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, rows]);

  /* ---------------- actions ---------------- */
  const exportCsv = () => {
    const list = selectedIds.length ? rows.filter((r) => selectedIds.includes(r.id)) : rows;
    const head = ["Sr. No.", "Registered Date", "Status", "Group Name", "Name", "Gender", "DOB", "Age", "Email Id", "Mobile No.", "Venue", "Start Day", "Stream", "Branch", "Year", "Team Lead", "Category", "College Name", "Organization Name", "Designation", "Experience", "Address"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = list.map((r, i) =>
      [i + 1, fmtDate(r.regDate), r.status, r.groupName, r.name, r.gender, fmtDate(r.dob), r.age, r.email, r.mobile, r.venue, r.startDay, r.stream, r.branch, r.year, r.teamLead, r.category, r.collegeName, r.organizationName, r.designation, r.experience, r.address].map(esc).join(",")
    );
    const blob = new Blob(["\ufeff" + [head.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "event-registrations.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const shareToCustom = () => {
    if (!selectedIds.length) {
      setMsg({ type: "error", text: "Select at least one participant first." });
      return;
    }
    navigate("/admin/customplus", {
      state: { participants: rows.filter((r) => selectedIds.includes(r.id)) },
    });
  };

  const handleSend = () => {
    if (!sendId.trim()) {
      setMsg({ type: "error", text: "Please enter the Id." });
      return;
    }
    setMsg({ type: "ok", text: `Mail sent for Id: ${sendId.trim()}` });
    setSendId("");
  };

  const openEdit = (r) =>
    setEdit({
      ...emptyEdit,
      id: r.id,
      name: r.name,
      groupName: r.groupName,
      gender: r.gender,
      dob: r.dob,
      age: String(r.age),
      category: r.category,
      email: r.email,
      mobile: r.mobile,
      collegeName: r.category === "Fresher" ? r.college1 : r.collegeName,
      stream: r.category === "Fresher" ? r.stream1 : r.stream,
      year: r.category === "Fresher" ? r.year1 : r.year,
      organizationName: r.organizationName,
      designation: r.designation,
      experience: r.experience,
      teamLead: r.teamLead,
      venue: r.venue,
      startDay: r.startDay,
      status: r.status,
      useGroup: r.groupName.trim() !== "",
    });

  const onEditChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "name") v = value.replace(/[^A-Za-z ]/g, "");
    if (name === "mobile") v = value.replace(/[^0-9]/g, "");
    setEdit((p) => ({ ...p, [name]: v }));
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== edit.id) return r;
        const fresher = edit.category === "Fresher";
        return {
          ...r,
          name: edit.name.trim(),
          groupName: edit.useGroup ? edit.groupName : r.groupName,
          gender: edit.gender,
          dob: edit.dob,
          age: Number(edit.age),
          category: edit.category,
          email: edit.email,
          mobile: edit.mobile,
          collegeName: fresher ? r.collegeName : edit.collegeName,
          stream: fresher ? r.stream : edit.stream,
          year: fresher ? r.year : edit.year,
          college1: fresher ? edit.collegeName : r.college1,
          stream1: fresher ? edit.stream : r.stream1,
          year1: fresher ? edit.year : r.year1,
          organizationName: edit.organizationName,
          designation: edit.designation,
          experience: edit.experience,
          teamLead: edit.teamLead,
          venue: edit.venue,
          startDay: edit.startDay,
          status: edit.status,
        };
      })
    );
    setEdit(null);
    setMsg({ type: "ok", text: "Participant details updated." });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="ap-page">
      <div className="ap-card">
        <button type="button" className="ap-back" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left" /> Back
        </button>

        <h3 className="ap-title">Events Reg. Details</h3>
        {(eventTitle || eventId) && (
          <p className="ap-subtitle">
            {eventTitle ? <strong>{eventTitle}</strong> : null}
            {eventId ? <span> &nbsp;(Event Id: {eventId})</span> : null}
          </p>
        )}

        {msg.text && <div className={`ap-msg ${msg.type}`}>{msg.text}</div>}

        <div className="ap-action-bar">
          <div className="ap-left">
            <button type="button" className="btn btn-success ap-btn" onClick={exportCsv}>Export to Excel</button>
            <button type="button" className="btn btn-primary ap-btn" onClick={shareToCustom}>
              Share to Custom{selectedIds.length ? ` (${selectedIds.length})` : ""}
            </button>
          </div>
          <div className="ap-right">
            <input
              type="text"
              className="ap-id-input"
              placeholder="Id *"
              maxLength={30}
              value={sendId}
              onChange={(e) => setSendId(e.target.value.replace(/[^0-9.\s-]/g, ""))}
            />
            <button type="button" className="btn btn-primary ap-btn" onClick={handleSend}>Send</button>
          </div>
        </div>

        <div className="ap-table">
          <DataTable columns={columns} data={rows} centerToolbar />
        </div>
      </div>

      {/* ================= EDIT PARTICIPANT MODAL ================= */}
      {edit && (
        <div className="ap-overlay" onMouseDown={(e) => e.target === e.currentTarget && setEdit(null)}>
          <form className="ap-modal" onSubmit={saveEdit}>
            <div className="ap-modal-header">
              <div className="ap-modal-title">
                <span className="ap-modal-icon"><i className="fa fa-user-edit" /></span>
                <div>
                  <h4>Edit Participant</h4>
                  <p>Update participant registration details</p>
                </div>
              </div>
              <button type="button" className="ap-modal-close" onClick={() => setEdit(null)} aria-label="Close">
                <i className="fa fa-times" />
              </button>
            </div>

            <div className="ap-modal-body">
              {/* Basic information */}
              <section className="ap-section">
                <h5><i className="fa fa-user" /> Basic Information</h5>
                <div className="ap-grid">
                  <label className="ap-field">Name <b>*</b>
                    <input name="name" value={edit.name} onChange={onEditChange} required maxLength={100} placeholder="Enter participant name" />
                  </label>
                  <label className="ap-field">Group Name
                    <input name="groupName" value={edit.groupName} onChange={onEditChange} maxLength={200} placeholder="Enter group name" />
                  </label>
                  <label className="ap-field">Gender <b>*</b>
                    <select name="gender" value={edit.gender} onChange={onEditChange} required>
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label className="ap-field">Date of Birth <b>*</b>
                    <input type="date" name="dob" value={edit.dob} onChange={onEditChange} required />
                  </label>
                  <label className="ap-field">Age <b>*</b>
                    <input type="number" name="age" min="1" max="149" value={edit.age} onChange={onEditChange} required placeholder="Enter age" />
                  </label>
                  <label className="ap-field">Category
                    <input name="category" value={edit.category} onChange={onEditChange} maxLength={50} placeholder="Enter category" />
                  </label>
                </div>
              </section>

              {/* Contact */}
              <section className="ap-section">
                <h5><i className="fa fa-address-book" /> Contact Information</h5>
                <div className="ap-grid">
                  <label className="ap-field">Email ID <b>*</b>
                    <input type="email" name="email" value={edit.email} onChange={onEditChange} required maxLength={255} placeholder="Enter email address" />
                  </label>
                  <label className="ap-field">Mobile No. <b>*</b>
                    <input name="mobile" value={edit.mobile} onChange={onEditChange} required inputMode="numeric" pattern="[0-9]{6,20}" title="Mobile number must contain 6 to 20 digits." maxLength={20} placeholder="Enter mobile number" />
                  </label>
                </div>
              </section>

              {/* Academic + professional */}
              <section className="ap-section">
                <h5><i className="fa fa-graduation-cap" /> Academic &amp; Professional Information</h5>
                <div className="ap-two">
                  <div className="ap-subcard">
                    <span className="ap-chip">EDUCATION</span>
                    <label className="ap-field">College Name
                      <input name="collegeName" value={edit.collegeName} onChange={onEditChange} maxLength={150} placeholder="Enter college name" />
                    </label>
                    <label className="ap-field">Stream
                      <input name="stream" value={edit.stream} onChange={onEditChange} maxLength={100} placeholder="Enter stream" />
                    </label>
                    <label className="ap-field">Academic Year
                      <input name="year" value={edit.year} onChange={onEditChange} maxLength={50} placeholder="Enter academic year" />
                    </label>
                  </div>
                  <div className="ap-subcard">
                    <span className="ap-chip pro">PROFESSIONAL</span>
                    <label className="ap-field">Organization Name
                      <input name="organizationName" value={edit.organizationName} onChange={onEditChange} maxLength={150} placeholder="Enter organization name" />
                    </label>
                    <div className="ap-grid">
                      <label className="ap-field">Designation
                        <input name="designation" value={edit.designation} onChange={onEditChange} maxLength={100} placeholder="Enter designation" />
                      </label>
                      <label className="ap-field">Experience
                        <input name="experience" value={edit.experience} onChange={onEditChange} maxLength={50} placeholder="e.g. 1.5 yrs" />
                      </label>
                    </div>
                    <label className="ap-field">Team Lead
                      <input name="teamLead" value={edit.teamLead} onChange={onEditChange} maxLength={100} placeholder="Enter team lead" />
                    </label>
                  </div>
                </div>
              </section>

              {/* Event info */}
              <section className="ap-section">
                <h5><i className="fa fa-calendar-check" /> Event Information</h5>
                <div className="ap-grid">
                  <label className="ap-field">Venue
                    <input name="venue" value={edit.venue} onChange={onEditChange} maxLength={500} placeholder="Enter event venue" />
                  </label>
                  <label className="ap-field">Start Day
                    <input name="startDay" value={edit.startDay} onChange={onEditChange} maxLength={255} placeholder="Enter start day" />
                  </label>
                </div>
              </section>

              {/* Result */}
              <section className="ap-section">
                <h5><i className="fa fa-trophy" /> Participation Result</h5>
                <label className="ap-group-check">
                  <input
                    type="checkbox"
                    checked={edit.useGroup}
                    onChange={(e) => setEdit((p) => ({ ...p, useGroup: e.target.checked }))}
                  />
                  <span>Group Name {edit.useGroup && edit.groupName ? `[${edit.groupName}]` : ""}</span>
                </label>
                <div className="ap-results">
                  {["Winner", "Runner-up", "Participant"].map((s) => (
                    <label key={s} className={`ap-result ${edit.status === s ? "on" : ""}`}>
                      <input type="radio" name="status" value={s} checked={edit.status === s} onChange={onEditChange} />
                      <i className={`fa ${s === "Winner" ? "fa-trophy" : s === "Runner-up" ? "fa-medal" : "fa-user"}`} />
                      <strong>{s}</strong>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="ap-modal-footer">
              <span className="ap-note"><i className="fa fa-info-circle" /> Fields marked with <b>*</b> are required</span>
              <div>
                <button type="button" className="ap-btn-cancel" onClick={() => setEdit(null)}>
                  <i className="fa fa-times" /> Cancel
                </button>
                <button type="submit" className="ap-btn-update">Update Details</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminParticipate;
