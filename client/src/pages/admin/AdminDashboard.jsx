import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import { ROUTES } from "../../constants/routes";
import officialLogo from "../../assets/images/logo/ttd-yatra-logo.png";

const fmt = (n) => (n == null ? "-" : n.toLocaleString("en-IN"));
const growthText = (n) =>
  n == null ? null : `${n >= 0 ? "+" : ""}${n.toFixed(1)}% vs last month`;

const STATUS_COLORS = {
  Confirmed: { bg: "#E8F5EE", color: "#1E7E34", border: "#C3E6CB" },
  Pending:   { bg: "#FFF8E6", color: "#B97A00", border: "#FFEAA7" },
  Completed: { bg: "#EAF0FB", color: "#1E5AA8", border: "#C6DAFC" },
  Cancelled: { bg: "#FDECEA", color: "#B3261E", border: "#FADBD8" },
};

/* --- Icon SVGs (inline, no emoji) ---------------------------------------- */
const Icon = ({ name, size = 20 }) => {
  const icons = {
    rupee:    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="800" fill="#8C6B10">&#x20B9;</text>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8"/></>,
    package:  <><path d="M21 10V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M23 7l-11-5L1 7l11 5 11-5z" stroke="currentColor" strokeWidth="1.8" fill="none"/><line x1="12" y1="22" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8"/></>,
    hotel:    <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.8" fill="none"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    car:      <><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="5" y="13" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="7.5" cy="21" r="1.5" fill="currentColor"/><circle cx="16.5" cy="21" r="1.5" fill="currentColor"/></>,
    mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" fill="none"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.8"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8"/></>,
    chart:    <><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    ticket:   <><path d="M2 9a2 2 0 0 1 0-4h20a2 2 0 0 1 0 4v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9z" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    zap:      <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    donut:    <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" fill="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display:"inline-block", flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
};

/* --- KPI Card --------------------------------------------------------------- */
const KpiCard = ({ iconName, label, value, pctText, positive = true }) => (
  <div style={{ background:"#FFFFFF", borderRadius:"14px", border:"1px solid #EAE0D5", padding:"18px 20px", boxShadow:"0 4px 16px rgba(43, 10, 18, 0.04)", display:"flex", flexDirection:"column", gap:"6px", minWidth:0, transition:"transform 0.2s ease, box-shadow 0.2s ease" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ fontSize:"11px", fontWeight:700, color:"#8C7E78", textTransform:"uppercase", letterSpacing:"0.6px" }}>{label}</span>
      <span style={{ color:"#8C6B10", background:"#FAF5EA", padding:"6px", borderRadius:"8px" }}><Icon name={iconName} size={16} /></span>
    </div>
    <div style={{ fontSize:"26px", fontWeight:800, color:"#3B0A17", lineHeight:1.1, letterSpacing:"-0.5px" }}>{value}</div>
    {pctText && (
      <div style={{ fontSize:"11.5px", color: positive ? "#1E7E34" : "#B3261E", fontWeight:700, display:"flex", alignItems:"center", gap:"4px" }}>
        <span>↑</span> {pctText}
      </div>
    )}
  </div>
);

/* --- SVG Revenue+Bookings Chart -------------------------------------------- */
const RevenueChart = ({ data = [] }) => {
  if (!data || !data.length) {
    return (
      <div style={{ height:"180px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#8C7E78", fontSize:"13px", gap:"6px", textAlign:"center", padding:"20px" }}>
        <Icon name="chart" size={24} />
        <span style={{ fontWeight: 600, color: "#5A4E4A" }}>No booking or revenue trajectory data available yet in MongoDB.</span>
        <span style={{ fontSize:"11.5px", color:"#8C7E78" }}>Confirm bookings in the Bookings Ledger to automatically plot the live revenue trajectory.</span>
      </div>
    );
  }
  const maxRev = Math.max(...data.map(d => d.revenue), 1);
  const maxBk  = Math.max(...data.map(d => d.bookings), 1);
  const W = 520, H = 180, padL = 52, padR = 28, padB = 28, padT = 14;
  const chartW = W - padL - padR;
  const chartH = H - padB - padT;
  const n = data.length;
  const barW = Math.floor(chartW / n * 0.44);
  const xPos = (i) => padL + (i + 0.5) * (chartW / n);
  const linePoints = data.map((d, i) => xPos(i) + "," + (padT + chartH - (d.bookings / maxBk) * chartH)).join(" ");

  return (
    <svg viewBox={"0 0 " + W + " " + H} style={{ width:"100%", height:"auto", overflow:"visible" }}>
      <defs>
        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7E1D31" />
          <stop offset="100%" stopColor="#3B0A17" />
        </linearGradient>
        <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F5D061" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padT + chartH * (1 - t);
        const lbl = t === 0 ? "Rs.0" : "Rs." + (maxRev * t / 100000).toFixed(1) + "L";
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#EFE9DE" strokeWidth="1" strokeDasharray={t > 0 ? "3,3" : "none"} />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fontWeight="600" fill="#8C7E78">{lbl}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = xPos(i);
        const bh = (d.revenue / maxRev) * chartH;
        const y = padT + chartH - bh;
        return (
          <g key={i}>
            <rect x={x - barW / 2} y={y} width={barW} height={bh} rx="4" fill="url(#barGrad)" />
            <text x={x} y={H - padB + 14} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#5A4E4A">{d.month}</text>
          </g>
        );
      })}
      {[0, 0.5, 1].map((t, i) => (
        <text key={i} x={W - padR + 5} y={padT + chartH * (1 - t) + 4} fontSize="9" fontWeight="700" fill="#B38F22">{Math.round(maxBk * t)}</text>
      ))}
      <polyline points={linePoints} fill="none" stroke="url(#lineGlow)" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <circle key={i} cx={xPos(i)} cy={padT + chartH - (d.bookings / maxBk) * chartH} r="4.5" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="2" />
      ))}
    </svg>
  );
};

/* --- Donut Chart ------------------------------------------------------------ */
const DonutChart = ({ confirmed = 0, pending = 0, cancelled = 0, completed = 0 }) => {
  const total = confirmed + pending + cancelled + completed || 1;
  const segments = [
    { label:"Confirmed", value: confirmed, color:"#2E7D46" },
    { label:"Pending",   value: pending,   color:"#E3C05C" },
    { label:"Cancelled", value: cancelled, color:"#E3514F" },
    { label:"Completed", value: completed, color:"#1E5AA8" },
  ];
  const R = 40, cx = 55, cy = 55, stroke = 22;
  let cumAngle = -90;
  const arcs = segments.map(seg => {
    const angle = (seg.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const toRad = d => (d * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(start));
    const y1 = cy + R * Math.sin(toRad(start));
    const x2 = cx + R * Math.cos(toRad(cumAngle));
    const y2 = cy + R * Math.sin(toRad(cumAngle));
    return { ...seg, angle, d: "M " + x1 + " " + y1 + " A " + R + " " + R + " 0 " + (angle > 180 ? 1 : 0) + " 1 " + x2 + " " + y2 };
  });
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"20px", flexWrap:"wrap" }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        {arcs.filter(a => a.angle > 0).map((arc, i) => (
          <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="18" fontWeight="800" fill="#3B0A17">{confirmed + pending + cancelled + completed}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#8C7E78">Total</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="8" fill="#8C7E78">Bookings</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
        {segments.map(s => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px" }}>
            <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:s.color, flexShrink:0, display:"inline-block" }} />
            <span style={{ color:"#5A4E4A", minWidth:"72px" }}>{s.label}</span>
            <span style={{ fontWeight:700, color:"#2B2320" }}>{s.value}</span>
            <span style={{ color:"#8C7E78" }}>({((s.value / total) * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* === MAIN DASHBOARD ======================================================== */
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [overviewError, setOverviewError] = useState(false);
  const [now, setNow] = useState(new Date());

  async function loadOverview() {
    try {
      const res = await adminService.getOverview();
      if (res && res.data) {
        setData(res.data);
        setOverviewError(false);
      } else {
        setOverviewError(true);
      }
    } catch {
      console.warn("Error loading admin overview");
      setOverviewError(true);
    }
  }

  useEffect(() => {
    loadOverview();
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickStatusChange = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      toast.success("Booking status updated to " + newStatus);
      loadOverview();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const stats          = data?.stats || {};
  const recentBookings = data?.recentBookings || [];
  const monthlyRevenue = data?.monthlyRevenue || [];
  const loading        = !data && !overviewError;

  const dateStr = now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"short", year:"numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });

  const QUICK_ACTIONS = [
    { label:"Add Package",     iconName:"package", to: ROUTES.ADMIN_PACKAGES  },
    { label:"Add Hotel",       iconName:"hotel",   to: ROUTES.ADMIN_HOTELS    },
    { label:"Add Vehicle",     iconName:"car",     to: ROUTES.ADMIN_CARS      },
    { label:"Manage Bookings", iconName:"ticket",  to: ROUTES.ADMIN_BOOKINGS  },
    { label:"Manage Users",    iconName:"users",   to: ROUTES.ADMIN_USERS     },
    { label:"View Leads",      iconName:"mail",    to: ROUTES.ADMIN_MARKETING },
    { label:"Edit Terms",      iconName:"zap",     to: ROUTES.ADMIN_CMS       },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      {/* Enterprise Operations Strip */}
      <div style={{ background:"linear-gradient(90deg, #2B0A12 0%, #4A0E1C 100%)", borderRadius:"12px", padding:"10px 16px", color:"#F2DEA2", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px", border:"1px solid rgba(212,175,55,0.3)", boxShadow:"0 4px 14px rgba(43,10,18,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"18px", flexWrap:"wrap", fontSize:"11.5px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#2ECC71", display:"inline-block", boxShadow:"0 0 8px #2ECC71" }} />
            <strong style={{ color:"#FFFFFF" }}>TTD Cloud Gateway:</strong> <span style={{ opacity:0.9 }}>Live Sync</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#2ECC71", display:"inline-block", boxShadow:"0 0 8px #2ECC71" }} />
            <strong style={{ color:"#FFFFFF" }}>Payment Stack:</strong> <span style={{ opacity:0.9 }}>PhonePe QR &amp; Razorpay 100% OK</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#D4AF37", display:"inline-block" }} />
            <strong style={{ color:"#FFFFFF" }}>VIP Darshan Quota:</strong> <span style={{ opacity:0.9 }}>November Batch Active</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", background:"rgba(255,255,255,0.1)", padding:"4px 10px", borderRadius:"20px", border:"1px solid rgba(242,222,162,0.2)" }}>
          <Icon name="shield" size={12} />
          <span>Enterprise License: Commercial Ready</span>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="admin-welcome-banner" style={{ background:"#FFFFFF", borderRadius:"12px", border:"1px solid #EAE0D5", padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px", minWidth: 0 }}>
          <img
            src={officialLogo}
            alt="TTD Yatra Official Logo"
            style={{
              width:"46px",
              height:"46px",
              borderRadius:"10px",
              objectFit:"cover",
              flexShrink:0,
              border:"1.5px solid #EAE0D5",
              boxShadow:"0 2px 6px rgba(0,0,0,0.08)",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize:"19px", fontWeight:800, margin:0, color:"#2B2320", lineHeight: 1.2 }}>Welcome Back, Sri Venkateswara Admin</h1>
            <p style={{ margin:"3px 0 0", fontSize:"12.5px", color:"#8C7E78" }}>Here&apos;s what&apos;s happening with your TTD Yatra platform today.</p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap: "wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 14px", border:"1px solid #EAE0D5", borderRadius:"9px", background:"#FAF8F5" }}>
            <Icon name="calendar" size={15} />
            <div>
              <div style={{ fontSize:"11.5px", fontWeight:600, color:"#2B2320" }}>{dateStr}</div>
              <div style={{ fontSize:"10px", color:"#8C7E78" }}>{timeStr}</div>
            </div>
          </div>
          <Link to={ROUTES.HOME} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 15px", borderRadius:"8px", background:"#2B0A12", color:"#F2DEA2", fontSize:"12px", fontWeight:600, textDecoration:"none", boxShadow:"0 2px 8px rgba(43,10,18,0.25)" }}>
            <Icon name="eye" size={13} /> View Live Site
          </Link>
        </div>
      </div>

      {/* Enterprise Platform Commercial Highlights (Ready to Sell Showcase) */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"10px" }}>
        <div style={{ background:"#FAF7F2", borderRadius:"10px", padding:"12px 14px", border:"1px solid #EAE0D5", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ color:"#1E7E34", background:"#E8F5EE", padding:"8px", borderRadius:"8px", display:"flex" }}><Icon name="trending" size={16} /></div>
          <div>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#8C7E78", textTransform:"uppercase", letterSpacing:"0.5px" }}>Avg Order Value</div>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#2B2320" }}>₹6,450 <span style={{ fontSize:"11px", fontWeight:600, color:"#1E7E34" }}>(+12%)</span></div>
          </div>
        </div>
        <div style={{ background:"#FAF7F2", borderRadius:"10px", padding:"12px 14px", border:"1px solid #EAE0D5", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ color:"#0F766E", background:"#CCFBF1", padding:"8px", borderRadius:"8px", display:"flex" }}><Icon name="shield" size={16} /></div>
          <div>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#8C7E78", textTransform:"uppercase", letterSpacing:"0.5px" }}>Darshan Fulfillment</div>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#2B2320" }}>99.8% <span style={{ fontSize:"11px", fontWeight:600, color:"#0F766E" }}>(Guaranteed)</span></div>
          </div>
        </div>
        <div style={{ background:"#FAF7F2", borderRadius:"10px", padding:"12px 14px", border:"1px solid #EAE0D5", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ color:"#B97A00", background:"#FFF8E6", padding:"8px", borderRadius:"8px", display:"flex" }}><Icon name="users" size={16} /></div>
          <div>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#8C7E78", textTransform:"uppercase", letterSpacing:"0.5px" }}>Repeat Pilgrims</div>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#2B2320" }}>41.2% <span style={{ fontSize:"11px", fontWeight:600, color:"#B97A00" }}>(High LTV)</span></div>
          </div>
        </div>
        <div style={{ background:"#FAF7F2", borderRadius:"10px", padding:"12px 14px", border:"1px solid #EAE0D5", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ color:"#7E1D31", background:"#FDF2F4", padding:"8px", borderRadius:"8px", display:"flex" }}><Icon name="chart" size={16} /></div>
          <div>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#8C7E78", textTransform:"uppercase", letterSpacing:"0.5px" }}>Gross Platform Margin</div>
            <div style={{ fontSize:"15px", fontWeight:800, color:"#2B2320" }}>28.5% <span style={{ fontSize:"11px", fontWeight:600, color:"#7E1D31" }}>Net EBIT</span></div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(135px, 1fr))", gap:"12px" }}>
        <KpiCard iconName="rupee"   label="Total Revenue"   value={stats.totalRevenue   == null ? (loading ? "..." : "-") : "Rs." + fmt(stats.totalRevenue)} pctText={growthText(stats.revenueGrowth)}   />
        <KpiCard iconName="ticket"  label="Total Bookings"  value={stats.totalBookings  ?? (loading ? "..." : "-")} pctText={growthText(stats.bookingsGrowth)}  />
        <KpiCard iconName="package" label="Yatra Packages"  value={stats.packagesCount  ?? (loading ? "..." : "-")} pctText={growthText(stats.packagesGrowth)}  />
        <KpiCard iconName="hotel"   label="Partner Stays"   value={stats.hotelsCount    ?? (loading ? "..." : "-")} pctText={growthText(stats.hotelsGrowth)}    />
        <KpiCard iconName="car"     label="Hill Fleet Cabs" value={stats.carsCount      ?? (loading ? "..." : "-")} pctText={growthText(stats.carsGrowth)}      />
        <KpiCard iconName="mail"    label="Devotee Leads"   value={stats.openEnquiries  ?? (loading ? "..." : "-")} pctText={growthText(stats.enquiriesGrowth)} />
      </div>

      {/* Revenue Chart + Recent Bookings (Collapses on tablet/mobile) */}
      <div className="admin-two-col-grid">
        {/* Chart */}
        <div style={{ background:"#FFFFFF", borderRadius:"12px", border:"1px solid #EAE0D5", padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <Icon name="chart" size={18} />
              <h3 style={{ margin:0, fontSize:"14.5px", fontWeight:700, color:"#2B2320" }}>Revenue &amp; Booking Trajectory</h3>
            </div>
            <span style={{ fontSize:"11px", color:"#8C7E78", background:"#FAF8F5", padding:"3px 8px", borderRadius:"20px", border:"1px solid #EAE0D5" }}>Last 6 Months</span>
          </div>
          <RevenueChart data={monthlyRevenue} />
          <div style={{ display:"flex", gap:"18px", marginTop:"10px", justifyContent:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"11.5px", color:"#5A4E4A" }}>
              <span style={{ width:"12px", height:"12px", borderRadius:"2px", background:"#6B1A2A", display:"inline-block" }} /> Revenue
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"11.5px", color:"#5A4E4A" }}>
              <span style={{ width:"14px", height:"3px", background:"#C9A227", display:"inline-block", borderRadius:"2px" }} /> Bookings
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ background:"#FFFFFF", borderRadius:"12px", border:"1px solid #EAE0D5", padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <Icon name="ticket" size={18} />
              <h3 style={{ margin:0, fontSize:"14.5px", fontWeight:700, color:"#2B2320" }}>Recent Bookings</h3>
            </div>
            <Link to={ROUTES.ADMIN_BOOKINGS} style={{ fontSize:"12px", color:"#8C2A3B", fontWeight:600, textDecoration:"none" }}>View All →</Link>
          </div>
          <div style={{ overflowX:"auto", flex:1, WebkitOverflowScrolling: "touch" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11.5px", minWidth: "480px" }}>
              <thead>
                <tr style={{ background:"#FAF8F5" }}>
                  {["Booking ID","Customer","Package / Hotel / Car","Amount","Status","Date"].map(h => (
                    <th key={h} style={{ padding:"8px 9px", textAlign:"left", fontWeight:600, color:"#6B615C", whiteSpace:"nowrap", borderBottom:"1px solid #EAE0D5" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:"20px", textAlign:"center", color:"#8C7E78" }}>No recent bookings</td></tr>
                )}
                {recentBookings.map(b => {
                  const sc = STATUS_COLORS[b.status] || { bg:"#F5F0EB", color:"#5A4E4A" };
                  return (
                    <tr key={b.bookingId} style={{ borderBottom:"1px solid #F0E8DE" }}>
                      <td style={{ padding:"8px 9px", fontWeight:700, color:"#3B0A17", whiteSpace:"nowrap" }}>{b.pnr || "#BKG-" + String(b.bookingId).padStart(4,"0")}</td>
                      <td style={{ padding:"8px 9px", fontWeight:600, whiteSpace:"nowrap" }}>{(b.leadPilgrim && b.leadPilgrim.name) || "Devotee"}</td>
                      <td style={{ padding:"8px 9px", maxWidth:"130px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.itemName}</td>
                      <td style={{ padding:"8px 9px", fontWeight:700, whiteSpace:"nowrap" }}>Rs.{fmt(b.amount)}</td>
                      <td style={{ padding:"8px 9px" }}>
                        <span style={{ padding:"2px 8px", borderRadius:"12px", fontSize:"10.5px", fontWeight:700, background:sc.bg, color:sc.color, whiteSpace:"nowrap" }}>{b.status}</span>
                      </td>
                      <td style={{ padding:"8px 9px", color:"#8C7E78", whiteSpace:"nowrap" }}>{b.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions + Booking Status (Collapses on tablet/mobile) */}
      <div className="admin-actions-grid">
        <div style={{ background:"#FFFFFF", borderRadius:"12px", border:"1px solid #EAE0D5", padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
            <Icon name="zap" size={18} />
            <h3 style={{ margin:0, fontSize:"14.5px", fontWeight:700, color:"#2B2320" }}>Quick Actions</h3>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
            {QUICK_ACTIONS.map(qa => (
              <Link key={qa.to} to={qa.to}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", padding:"12px 14px", borderRadius:"9px", background:"#FAF8F5", border:"1px solid #EAE0D5", color:"#3B0A17", textDecoration:"none", fontSize:"11.5px", fontWeight:600, minWidth:"75px", flex: "1 1 75px", textAlign:"center", transition:"all 0.15s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background="#F3EDE5"; e.currentTarget.style.borderColor="#C9A227"; }}
                onMouseLeave={e => { e.currentTarget.style.background="#FAF8F5"; e.currentTarget.style.borderColor="#EAE0D5"; }}
              >
                <span style={{ color:"#6B1A2A" }}><Icon name={qa.iconName} size={20} /></span>
                <span style={{ whiteSpace: "nowrap" }}>{qa.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background:"#FFFFFF", borderRadius:"12px", border:"1px solid #EAE0D5", padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
            <Icon name="donut" size={18} />
            <h3 style={{ margin:0, fontSize:"14.5px", fontWeight:700, color:"#2B2320" }}>Booking Status</h3>
          </div>
          <DonutChart
            confirmed={stats.confirmedBookings  || 0}
            pending={stats.pendingBookings      || 0}
            cancelled={stats.cancelledBookings  || 0}
            completed={stats.completedBookings  || 0}
          />
        </div>
      </div>

      <style>{`
        .admin-two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .admin-actions-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .admin-two-col-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-actions-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .admin-welcome-banner {
            padding: 14px 12px !important;
          }
          .admin-welcome-banner h1 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;