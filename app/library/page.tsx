import Link from "next/link";

export default function LibraryPage() {
  const tickets = [
    { category: "Academic staff", lending: "02", reference: "02", total: "04" },
    { category: "Temporary academic staff / Visiting lecturers", lending: "02", reference: "02", total: "04" },
    { category: "Non-Academic staff (Executive)", lending: "02", reference: "02", total: "04" },
    { category: "Non-Academic staff", lending: "02", reference: "02", total: "04" },
    { category: "Students", lending: "02", reference: "02", total: "04" },
  ];

  const circulation = [
    { category: "Academic staff", lending: "One month", reference: "One week" },
    { category: "Visiting lecturers", lending: "Two weeks", reference: "One week" },
    { category: "Non-Academic staff (Executive)", lending: "Two weeks", reference: "One week" },
    { category: "Non-Academic staff", lending: "Two weeks", reference: "–" },
    { category: "Students", lending: "One week", reference: "Overnight" },
  ];

  const fines = [
    { period: "1–7 days after the due date", lending: "Rs. 10.00 per day", reference: "Rs. 20.00 per day" },
    { period: "From 2nd week onwards", lending: "Rs. 20.00 per day", reference: "Rs. 50.00 per day" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@600;700;800&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* ===== HERO BANNER ===== */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f1c2e 0%, #1a3a5c 60%, #e85d14 120%)",
          minHeight: "260px",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(232,93,20,0.4) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10">
          <div className="text-[#e85d14] text-[13px] font-semibold tracking-widest uppercase mb-3">
            <i className="fas fa-book-open mr-2"></i>
            University College of Jaffna
          </div>
          <h1 className="font-poppins text-white font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-3">
            University <span className="text-[#e85d14]">Library</span>
          </h1>
          <p className="text-white/70 text-[15px] mb-5">
            Knowledge is the foundation of every great achievement
          </p>
          <div className="text-white/50 text-[13px]">
            <Link href="/" className="hover:text-[#e85d14] transition-colors">
              Home
            </Link>
            {" / "}
            <span className="text-[#e85d14]">Library</span>
          </div>
        </div>
      </div>

      {/* ===== OPENING HOURS BANNER ===== */}
      <div className="bg-[#1a2f4a] py-4 px-5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
            <i className="fas fa-clock text-[14px]"></i>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-white/60 text-[13px] font-semibold uppercase tracking-wider">
              Opening Hours
            </span>
            <div className="w-px h-4 bg-white/30 hidden sm:block"></div>
            <span className="text-white text-[14px]">
              <i className="fas fa-calendar-week text-[#e85d14] mr-2 text-[12px]"></i>
              Weekdays: 8.30 a.m. – 4.18 p.m.
            </span>
          </div>
        </div>
      </div>

      {/* ===== COLLECTION ===== */}
      <section className="py-16 px-5 bg-[#f0f4f8]">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-layer-group text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Collection
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <ul className="flex flex-col gap-4 text-[14px] text-[#607080] leading-[1.75]">
              <li>
                <span className="font-bold text-[#0f1c2e]">Books –</span>{" "}
                Lending (LDG), Academic American (AA), Professional Reference (CR)
              </li>
              <li>
                <span className="font-bold text-[#0f1c2e]">Journals –</span>{" "}
                American e-Collection · American Chemical Society (ACS) Publications
                Collection · Bibliographic Reference &amp; Subscription Program · Sri
                Lankan Collection · Donations
              </li>
              <li>
                <span className="font-bold text-[#0f1c2e]">Special Collection –</span>{" "}
                Dictionaries, SRI Standards, LG Collection, ICAO, Nonfictions
                Collection, SRI Technical Line Collection, Research Papers
              </li>
              <li>
                <span className="font-bold text-[#0f1c2e]">CD-Collection</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== LIBRARY MEMBERSHIP ===== */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-id-card text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Library Membership
            </h2>
          </div>
          <div className="bg-[#f0f4f8] rounded-2xl border border-gray-200 p-8 shadow-sm">
            <ul className="flex flex-col gap-3 text-[14px] text-[#607080] leading-[1.75]">
              {[
                "Permanent members of the academic staff",
                "Temporary members of the academic staff / Visiting lecturers",
                "Permanent members of the non-academic staff",
                "Students",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#e85d14] mt-1 flex-shrink-0">
                    <i className="fas fa-circle text-[6px]"></i>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== REGISTRATION ===== */}
      <section className="py-16 px-5 bg-[#f0f4f8]">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-user-plus text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Registration
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col gap-3 text-[14px] text-[#607080] leading-[1.75]">
            <p>
              Registration is mandatory to use the library for all students and staff
              of the University College, prior to using the library.
            </p>
            <p>
              Any person wishing to register should offer the ID Card to the
              satisfaction of the Librarian or Library Staff.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LIBRARY TICKETS TABLE ===== */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-ticket text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Entitlement of Library Tickets
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-[14px] text-[#607080]">
              <thead>
                <tr className="bg-[#1a2f4a] text-white">
                  <th className="text-left px-5 py-3 font-semibold">Category</th>
                  <th className="text-center px-5 py-3 font-semibold">Lending Cards</th>
                  <th className="text-center px-5 py-3 font-semibold">Reference Cards</th>
                  <th className="text-center px-5 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((row, i) => (
                  <tr
                    key={row.category}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#f0f4f8]"}
                  >
                    <td className="px-5 py-3">{row.category}</td>
                    <td className="px-5 py-3 text-center">{row.lending}</td>
                    <td className="px-5 py-3 text-center">{row.reference}</td>
                    <td className="px-5 py-3 text-center font-semibold text-[#0f1c2e]">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-2 text-[13px] text-[#607080] bg-[#f0f4f8] border border-gray-200 rounded-xl px-4 py-3">
            <i className="fas fa-circle-info text-[#e85d14] mt-0.5 flex-shrink-0"></i>
            <span>
              Library cards are not transferable. The holder of library tickets is
              responsible for any library material issued under such tickets and
              therefore should protect them with utmost care.
            </span>
          </div>
        </div>
      </section>

      {/* ===== CIRCULATION TABLE ===== */}
      <section className="py-16 px-5 bg-[#f0f4f8]">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-arrows-rotate text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Circulation
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-[14px] text-[#607080]">
              <thead>
                <tr className="bg-[#1a2f4a] text-white">
                  <th className="text-left px-5 py-3 font-semibold">Category</th>
                  <th className="text-center px-5 py-3 font-semibold">Lending Period</th>
                  <th className="text-center px-5 py-3 font-semibold">Reference Period</th>
                </tr>
              </thead>
              <tbody>
                {circulation.map((row, i) => (
                  <tr
                    key={row.category}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#f0f4f8]"}
                  >
                    <td className="px-5 py-3">{row.category}</td>
                    <td className="px-5 py-3 text-center">{row.lending}</td>
                    <td className="px-5 py-3 text-center">{row.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== RESERVATION ===== */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-bookmark text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Reservation
            </h2>
          </div>
          <div className="bg-[#f0f4f8] rounded-2xl border border-gray-200 p-8 shadow-sm text-[14px] text-[#607080] leading-[1.75]">
            <p>
              Readers can reserve books for their needs according to the reservation
              procedure of the library.
            </p>
          </div>
        </div>
      </section>

      {/* ===== DAMAGE & LOSS ===== */}
      <section className="py-16 px-5 bg-[#f0f4f8]">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-triangle-exclamation text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Damage and Loss of Library Books
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col gap-4 text-[14px] text-[#607080] leading-[1.75]">
            <p>
              Marking and defacing of books is strictly forbidden. Users should report
              any such marks or damages to books if found, to the Issuing counter. In
              absence of such a report, the borrower will be held responsible and fined
              for any damage observed at the time the books are returned.
            </p>
            <p>
              It is the responsibility of the borrower to protect library materials
              borrowed from the Library. Any loss of library materials should be
              reported immediately. In such situations, a copy of the same edition or a
              later edition of the title lost can be produced as a replacement, or the
              fee charged by the Library has to be paid by the borrower.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LIBRARY FINES TABLE ===== */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#e85d14] flex items-center justify-center text-white flex-shrink-0">
              <i className="fas fa-coins text-[13px]"></i>
            </div>
            <h2 className="font-playfair text-[clamp(20px,2.5vw,28px)] font-bold text-[#0f1c2e]">
              Library Fines
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-[14px] text-[#607080]">
              <thead>
                <tr className="bg-[#1a2f4a] text-white">
                  <th className="text-left px-5 py-3 font-semibold">Overdue Period</th>
                  <th className="text-center px-5 py-3 font-semibold">Lending Fine</th>
                  <th className="text-center px-5 py-3 font-semibold">Reference Fine</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((row, i) => (
                  <tr
                    key={row.period}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#f0f4f8]"}
                  >
                    <td className="px-5 py-3">{row.period}</td>
                    <td className="px-5 py-3 text-center">{row.lending}</td>
                    <td className="px-5 py-3 text-center">{row.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-2 text-[13px] text-[#607080] bg-[#f0f4f8] border border-gray-200 rounded-xl px-4 py-3">
            <i className="fas fa-circle-info text-[#e85d14] mt-0.5 flex-shrink-0"></i>
            <span>
              Fines must be cleared before borrowing additional materials or obtaining
              clearance certificates.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}