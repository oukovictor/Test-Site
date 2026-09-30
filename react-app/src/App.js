import React, { useEffect, useMemo, useState } from 'react';

const fixtures = [
  {
    opponent: 'Cloth Millers',
    date: '2026-08-01T15:00:00+03:00',
    timeLabel: '15:00 EAT',
    venue: 'San Siro, Kincar · League fixture'
  },
  {
    opponent: 'Kasarani FC',
    date: '2026-08-15T15:00:00+03:00',
    timeLabel: '15:00 EAT',
    venue: 'Kasarani Stadium · Cup fixture'
  },
  {
    opponent: 'Mwiki United',
    date: '2026-08-29T15:00:00+03:00',
    timeLabel: '15:00 EAT',
    venue: 'Kincar Pitch · Friendly'
  }
];

const buildFixture = (upcomingFixture) => {
  const target = new Date(upcomingFixture.date).getTime();
  const now = Date.now();

  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return {
    opponent: upcomingFixture.opponent,
    dateLabel: new Intl.DateTimeFormat('en', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(upcomingFixture.date)),
    timeLabel: upcomingFixture.timeLabel,
    venue: upcomingFixture.venue,
    countdown: {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0')
    }
  };
};

const App = () => {
  const upcomingFixture = useMemo(() => {
    return fixtures
      .filter((fixture) => new Date(fixture.date).getTime() > Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || fixtures[0];
  }, []);

  const [countdown, setCountdown] = useState(() => buildFixture(upcomingFixture).countdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(buildFixture(upcomingFixture).countdown);
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingFixture]);

  return (
    <div>
      <div className="stripes" />
      <nav>
        <a className="brand" href="#top">
          <svg className="brand-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="47" fill="#05070F" stroke="#16A34A" strokeWidth="3" />
            <path d="M50 3 A47 47 0 0 1 50 97 Z" fill="#000000" />
            <path d="M50 3 A47 47 0 0 0 50 97 Z" fill="#16A34A" />
            <text x="50" y="60" fontFamily="Anton" fontSize="34" fill="#FFFFFF" textAnchor="middle">U</text>
          </svg>
          UTAWALA YOUTH
        </a>
        <button className="nav-toggle" aria-label="Toggle menu" type="button">☰</button>
        <ul id="navList">
          <li><a href="#philosophy">Philosophy</a></li>
          <li><a href="#history">History</a></li>
          <li><a href="#legends">Players</a></li>
          <li><a href="#countdown">Next Match</a></li>
          <li><a href="#shop">Shop</a></li>
          <li><a href="#camp">Stadium</a></li>
        </ul>
      </nav>

      <header className="hero" id="top">
        <div className="hero-eyebrow">An unofficial fan tribute · est. 2005</div>
        <h1>PRIDE YA<br /><span>MTAA</span></h1>
        <p className="tagline">Pride of the neighbourhood. A club raised on Utawala's own pitches, an academy that turns local kids into first-team players, and a badge that carries the mtaa's name onto the field.</p>
        <div className="est">
          <div className="est-item"><b>2005</b>Founded in Utawala</div>
          <div className="est-item"><b>Utawala Youth Academy</b>The academy that builds the style</div>
          <div className="est-item"><b>San Siro (Kincar)</b>Home ground, Utawala</div>
        </div>
        <div className="scroll-cue">
          <div className="bar" />
          SCROLL
        </div>
      </header>

      <section id="philosophy" className="philosophy">
        <div className="philo-grid">
          <div className="reveal">
            <p className="eyebrow">The idea</p>
            <div className="quote-block">
              Chezea mtaa kwanza — the badge on your chest matters more than the name on your back, and the team that works hardest for each other wins respect.
              <span className="quote-attr">— the club ethos passed down by Utawala Youth's early coaches</span>
            </div>
          </div>
          <div className="pillars reveal">
            <div className="pillar">
              <h3>Estate first</h3>
              <p>Matchday starts with the neighbourhood in the stands. Every result is felt on the streets of Utawala before it's felt anywhere else.</p>
            </div>
            <div className="pillar">
              <h3>Grown, not bought</h3>
              <p>Utawala Youth Academy has fed the first team since day one — kids who learn the same style together, from the same pitches.</p>
            </div>
            <div className="pillar">
              <h3>Identity over ego</h3>
              <p>The badge is bigger than any single name on the shirt — an idea the club has repeated since it was founded in 2005.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="history">
        <div className="section-head reveal">
          <p className="eyebrow">Chronicle</p>
          <h2>A club shaped by its mtaa</h2>
          <p className="lede">A handful of turning points that explain why the badge means what it means today.</p>
        </div>
        <div className="timeline">
          <div className="tl-item reveal">
            <div className="tl-year">2005</div>
            <div className="tl-body">
              <h3>A group of estate players starts a club</h3>
              <p>Founded by a small group of footballers from around Utawala, at a time when the area had no club of its own to rally behind.</p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-year">2011</div>
            <div className="tl-body">
              <h3>A home ground of its own</h3>
              <p>The club settles permanently on its Kincar pitch, affectionately nicknamed "San Siro" by supporters for its atmosphere on matchday.</p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-year">2014</div>
            <div className="tl-body">
              <h3>Utawala Youth Academy opens its doors</h3>
              <p>A dedicated academy begins turning promising kids from the estate into first-team players on a single, shared style of play.</p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-year">2018</div>
            <div className="tl-body">
              <h3>First silverware</h3>
              <p>A team built largely from academy graduates delivers the club's first major local title, cementing "Pride ya Mtaa" as more than a slogan.</p>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-year">2020–present</div>
            <div className="tl-body">
              <h3>An academy-built squad</h3>
              <p>A first team built mostly from homegrown players carries the estate's name into regional competitions, playing a style studied by neighbouring clubs.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="legends">
        <div className="section-head reveal">
          <p className="eyebrow">Hall of fame</p>
          <h2>Names the badge remembers</h2>
          <p className="lede">A handful of the players and coaches most associated with the club's style, across different eras. (Placeholder names below — swap in your actual squad legends any time.)</p>
        </div>
        <div className="legends-grid reveal">
          <div className="legend-card">
            <div className="legend-num"><span>FOUNDING CAPTAIN</span><span className="jersey">4</span></div>
            <h3>[Founding Captain]</h3>
            <p>Led the original 2005 squad and set the standard for how the club plays and carries itself.</p>
          </div>
          <div className="legend-card">
            <div className="legend-num"><span>ACADEMY GRADUATE</span><span className="jersey">10</span></div>
            <h3>[Top Scorer]</h3>
            <p>Academy graduate who became the club's all-time leading scorer and its first breakout talent.</p>
          </div>
          <div className="legend-card">
            <div className="legend-num"><span>DEEP-LYING PLAYMAKER</span><span className="jersey">6</span></div>
            <h3>[Playmaker]</h3>
            <p>Controlled the tempo of the 2018 title-winning side before staying on in a coaching role.</p>
          </div>
          <div className="legend-card">
            <div className="legend-num"><span>LATE-GAME DECIDER</span><span className="jersey">8</span></div>
            <h3>[Clutch Player]</h3>
            <p>Known around Utawala for producing decisive goals in the club's biggest local derbies.</p>
          </div>
          <div className="legend-card">
            <div className="legend-num"><span>CAPTAIN, DEFENDER</span><span className="jersey">5</span></div>
            <h3>[Long-Serving Captain]</h3>
            <p>Academy-raised centre-back and long-serving captain known for leading by example on the Kincar pitch.</p>
          </div>
          <div className="legend-card">
            <div className="legend-num"><span>PLAYER & COACH</span><span className="jersey">14</span></div>
            <h3>[Player-Coach]</h3>
            <p>Former midfielder who, as coach, built the academy pipeline that still feeds the first team today.</p>
          </div>
        </div>
      </section>

      <section id="countdown" className="countdown">
        <div className="section-head reveal">
          <p className="eyebrow">Next match</p>
          <h2>Countdown to kickoff</h2>
        </div>

        <div className="fixture-card reveal" id="fixtureCard">
          <div className="fixture-teams">Utawala Youth <span className="vs">vs</span> <span id="fixtureOpponent">{upcomingFixture.opponent}</span></div>
          <div className="fixture-meta">
            <span><b id="fixtureDate">{buildFixture(upcomingFixture).dateLabel}</b> · <span id="fixtureTime">{upcomingFixture.timeLabel}</span></span>
            <span id="fixtureVenue">{upcomingFixture.venue}</span>
          </div>
        </div>

        <div className="count-grid reveal" id="countdownGrid">
          <div className="count-cell"><div className="count-num" id="cd-days">{countdown.days}</div><div className="count-label">Days</div></div>
          <div className="count-cell"><div className="count-num" id="cd-hours">{countdown.hours}</div><div className="count-label">Hours</div></div>
          <div className="count-cell"><div className="count-num" id="cd-mins">{countdown.mins}</div><div className="count-label">Minutes</div></div>
          <div className="count-cell"><div className="count-num" id="cd-secs">{countdown.secs}</div><div className="count-label">Seconds</div></div>
        </div>
        <p className="countdown-note" id="fixtureNote">Next fixture loaded: {upcomingFixture.opponent} on {buildFixture(upcomingFixture).dateLabel}.</p>
      </section>

      <section id="shop" className="shop">
        <div className="section-head reveal">
          <p className="eyebrow">Club store</p>
          <h2>Wear the badge. Fuel the club.</h2>
          <p className="lede">Every kit sold and every contribution goes straight back into pitch fees, kit, and keeping Utawala Youth Academy free for local kids.</p>
        </div>

        <div className="shop-grid reveal">
          <div className="jersey-card">
            <div className="jersey-swatch">
              <svg viewBox="0 0 120 130" width="110" height="120">
                <path d="M30 8 L45 2 L60 12 L75 2 L90 8 L110 26 L96 42 L88 34 L88 122 L32 122 L32 34 L24 42 L10 26 Z" fill="#000000" stroke="#16A34A" strokeWidth="3" />
                <rect x="32" y="34" width="56" height="88" fill="#16A34A" opacity="0.9" />
                <rect x="52" y="34" width="16" height="88" fill="#000000" />
              </svg>
            </div>
            <div>
              <span className="jtag">Home kit</span>
              <h3>2026 Home Jersey</h3>
            </div>
            <div className="jersey-price">KES 2,500</div>
            <div className="jersey-row">
              <select className="size-select" aria-label="Select size">
                <option>S</option><option>M</option><option selected>L</option><option>XL</option><option>XXL</option>
              </select>
              <button className="add-btn" type="button" data-item="Home Jersey">Add to cart</button>
            </div>
          </div>

          <div className="jersey-card">
            <div className="jersey-swatch">
              <svg viewBox="0 0 120 130" width="110" height="120">
                <path d="M30 8 L45 2 L60 12 L75 2 L90 8 L110 26 L96 42 L88 34 L88 122 L32 122 L32 34 L24 42 L10 26 Z" fill="#16A34A" stroke="#000000" strokeWidth="3" />
                <rect x="32" y="34" width="56" height="88" fill="#FFFFFF" opacity="0.95" />
                <rect x="32" y="34" width="56" height="14" fill="#000000" />
              </svg>
            </div>
            <div>
              <span className="jtag">Away kit</span>
              <h3>2026 Away Jersey</h3>
            </div>
            <div className="jersey-price">KES 2,500</div>
            <div className="jersey-row">
              <select className="size-select" aria-label="Select size">
                <option>S</option><option>M</option><option selected>L</option><option>XL</option><option>XXL</option>
              </select>
              <button className="add-btn" type="button" data-item="Away Jersey">Add to cart</button>
            </div>
          </div>

          <div className="jersey-card">
            <div className="jersey-swatch">
              <svg viewBox="0 0 120 130" width="110" height="120">
                <path d="M30 8 L45 2 L60 12 L75 2 L90 8 L110 26 L96 42 L88 34 L88 122 L32 122 L32 34 L24 42 L10 26 Z" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="3" />
                <rect x="32" y="34" width="56" height="88" fill="#0A0A0A" />
                <path d="M32 34 L88 34 L88 44 L60 60 L32 44 Z" fill="#16A34A" />
              </svg>
            </div>
            <div>
              <span className="jtag">Training kit</span>
              <h3>Academy Training Tee</h3>
            </div>
            <div className="jersey-price">KES 1,200</div>
            <div className="jersey-row">
              <select className="size-select" aria-label="Select size">
                <option>S</option><option>M</option><option selected>L</option><option>XL</option><option>XXL</option>
              </select>
              <button className="add-btn" type="button" data-item="Training Tee">Add to cart</button>
            </div>
          </div>
        </div>

        <div className="support-panel reveal">
          <div className="support-copy">
            <p className="eyebrow" style={{ marginBottom: '8px' }}>Support the club</p>
            <h3>Contribute to Utawala Youth</h3>
            <p>Kit, referees, transport to away fixtures, and free places at the academy all run on community support. Any amount helps keep the club going.</p>
            <p className="payment-note">Contributions can also be sent directly via M-Pesa Till Number: <strong>[ADD TILL NUMBER]</strong></p>
          </div>
          <div className="support-form">
            <div className="amount-grid" id="amountGrid">
              <button className="amount-btn" type="button" data-amount="500">KES 500</button>
              <button className="amount-btn" type="button" data-amount="1000">KES 1,000</button>
              <button className="amount-btn" type="button" data-amount="2500">KES 2,500</button>
            </div>
            <div className="custom-row">
              <input type="number" id="customAmount" placeholder="Custom amount (KES)" min="1" />
            </div>
            <button className="contribute-btn" type="button" id="contributeBtn">Contribute now</button>
            <p className="shop-disclaimer">This store and contribution box are a front-end demo — connect a payment provider (e.g. M-Pesa Daraja API or a card processor) to accept real transactions.</p>
          </div>
        </div>
      </section>

      <section id="camp" className="stadium">
        <div className="reveal">
          <p className="eyebrow">Home ground</p>
          <h2>San Siro, Kincar</h2>
          <p className="lede">Settled on permanently in 2011, the Kincar pitch earned its nickname from supporters for the atmosphere it produces on matchday — a nod to ambition, borrowed with a wink from Milan.</p>
        </div>
        <div className="stadium-fig reveal">
          <div className="row"><span>Neighbourhood</span><b>Kincar, Utawala</b></div>
          <div className="row"><span>Home since</span><b>2011</b></div>
          <div className="row"><span>Known for</span><b>Matchday atmosphere on the estate's own pitch</b></div>
          <div className="row"><span>Nickname</span><b>San Siro — a fan-given name</b></div>
        </div>
      </section>

      <div className="stripes" />
      <footer>
        <div>
          <div className="fbrand">UTAWALA YOUTH</div>
          <p className="fnote">An unofficial fan tribute page for Utawala Youth FC, built for design purposes. Player names in the Hall of Fame are placeholders — swap in the real squad legends whenever you're ready. "Pride ya Mtaa."</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
