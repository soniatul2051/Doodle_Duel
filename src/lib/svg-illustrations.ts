/**
 * Generates clean, recognizable, hand-drawn Pictionary-style SVG illustrations
 * on an uncluttered sketchpad background without including the written word inside the image.
 */

function wrapSketchSvg(innerContent: string, accentColor = '#4F46E5'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" fill="none">
    <defs>
      <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="1.2" fill="#CBD5E1" />
      </pattern>
      <filter id="sketchShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.08"/>
      </filter>
    </defs>
    <!-- Uncluttered Sketchpad Background -->
    <rect width="400" height="300" rx="20" fill="#FFFDF9" />
    <rect x="10" y="10" width="380" height="280" rx="14" fill="url(#dotGrid)" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="6 4" />
    <!-- Soft Accent Halo -->
    <circle cx="200" cy="150" r="95" fill="${accentColor}" fill-opacity="0.06" />
    <!-- Main Hand-Drawn Sketch Group -->
    <g filter="url(#sketchShadow)" stroke="#1E293B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      ${innerContent}
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const WORD_SVG_RECIPES: Record<string, { accent: string; body: string }> = {
  // ANIMALS
  elephant: {
    accent: '#64748B',
    body: `
      <ellipse cx="185" cy="165" rx="68" ry="48" fill="#CBD5E1"/>
      <rect x="135" y="195" width="18" height="45" rx="6" fill="#CBD5E1"/>
      <rect x="165" y="200" width="18" height="42" rx="6" fill="#94A3B8"/>
      <rect x="202" y="198" width="18" height="44" rx="6" fill="#CBD5E1"/>
      <rect x="228" y="195" width="16" height="40" rx="6" fill="#94A3B8"/>
      <path d="M118 152 Q95 165 98 185" stroke-width="3"/>
      <circle cx="250" cy="145" r="36" fill="#CBD5E1"/>
      <ellipse cx="225" cy="145" rx="22" ry="30" fill="#94A3B8"/>
      <path d="M278 152 C308 155 315 200 292 205 C278 208 278 190 290 190" fill="none" stroke-width="12"/>
      <path d="M268 168 Q290 178 298 165" stroke="#FEF08A" stroke-width="6"/>
      <circle cx="262" cy="136" r="4" fill="#1E293B"/>
      <path d="M300 120 Q312 100 322 115" stroke="#38BDF8" stroke-width="3"/>
    `,
  },
  giraffe: {
    accent: '#F59E0B',
    body: `
      <ellipse cx="165" cy="185" rx="45" ry="26" fill="#FDE047"/>
      <line x1="132" y1="205" x2="128" y2="258" stroke-width="5"/>
      <line x1="152" y1="208" x2="152" y2="258" stroke-width="5"/>
      <line x1="185" y1="208" x2="185" y2="258" stroke-width="5"/>
      <line x1="202" y1="205" x2="208" y2="258" stroke-width="5"/>
      <path d="M192 172 L245 68 L264 75 L208 185 Z" fill="#FDE047"/>
      <ellipse cx="262" cy="68" rx="18" ry="12" fill="#FDE047"/>
      <line x1="252" y1="56" x2="248" y2="42" stroke-width="3"/>
      <circle cx="248" cy="40" r="4" fill="#92400E"/>
      <line x1="262" y1="56" x2="264" y2="42" stroke-width="3"/>
      <circle cx="264" cy="40" r="4" fill="#92400E"/>
      <circle cx="266" cy="66" r="2.5" fill="#1E293B"/>
      <circle cx="155" cy="180" r="6" fill="#B45309" stroke="none"/>
      <circle cx="178" cy="190" r="7" fill="#B45309" stroke="none"/>
      <circle cx="215" cy="145" r="5" fill="#B45309" stroke="none"/>
      <circle cx="232" cy="112" r="5" fill="#B45309" stroke="none"/>
    `,
  },
  octopus: {
    accent: '#EC4899',
    body: `
      <path d="M150 135 C150 75 250 75 250 135 C250 158 232 168 200 168 C168 168 150 158 150 135 Z" fill="#F472B6"/>
      <circle cx="182" cy="130" r="8" fill="#FFFFFF"/>
      <circle cx="182" cy="130" r="3" fill="#1E293B"/>
      <circle cx="218" cy="130" r="8" fill="#FFFFFF"/>
      <circle cx="218" cy="130" r="3" fill="#1E293B"/>
      <path d="M190 148 Q200 156 210 148" fill="none"/>
      <path d="M162 162 C130 185 100 175 95 205 C92 222 115 225 120 210" fill="none" stroke="#F472B6" stroke-width="10"/>
      <path d="M162 162 C130 185 100 175 95 205 C92 222 115 225 120 210" fill="none"/>
      <path d="M175 166 C155 205 135 235 152 248" fill="none"/>
      <path d="M190 168 C182 210 178 242 192 252" fill="none"/>
      <path d="M210 168 C218 210 222 242 208 252" fill="none"/>
      <path d="M225 166 C245 205 265 235 248 248" fill="none"/>
      <path d="M238 162 C270 185 300 175 305 205 C308 222 285 225 280 210" fill="none"/>
      <circle cx="132" cy="188" r="3" fill="#FBCFE8"/>
      <circle cx="158" cy="215" r="3" fill="#FBCFE8"/>
      <circle cx="242" cy="215" r="3" fill="#FBCFE8"/>
      <circle cx="268" cy="188" r="3" fill="#FBCFE8"/>
    `,
  },
  butterfly: {
    accent: '#8B5CF6',
    body: `
      <path d="M195 130 C130 65 85 105 120 155 C140 170 175 165 195 158 Z" fill="#C084FC"/>
      <path d="M205 130 C270 65 315 105 280 155 C260 170 225 165 205 158 Z" fill="#C084FC"/>
      <path d="M195 160 C140 168 115 225 162 232 C185 235 194 200 196 182 Z" fill="#F472B6"/>
      <path d="M205 160 C260 168 285 225 238 232 C215 235 206 200 204 182 Z" fill="#F472B6"/>
      <ellipse cx="200" cy="162" rx="7" ry="44" fill="#334155"/>
      <circle cx="200" cy="112" r="9" fill="#334155"/>
      <path d="M196 104 Q180 75 166 86" fill="none"/>
      <path d="M204 104 Q220 75 234 86" fill="none"/>
      <circle cx="145" cy="125" r="12" fill="#FEF08A"/>
      <circle cx="255" cy="125" r="12" fill="#FEF08A"/>
    `,
  },
  kangaroo: {
    accent: '#D97706',
    body: `
      <path d="M165 185 Q115 215 90 225" stroke-width="10"/>
      <ellipse cx="190" cy="168" rx="34" ry="46" fill="#FBBF24"/>
      <path d="M165 210 L215 210 L232 235 L155 235 Z" fill="#F59E0B"/>
      <ellipse cx="205" cy="108" rx="18" ry="22" fill="#FBBF24"/>
      <path d="M195 90 L188 65 L202 86 Z" fill="#FBBF24"/>
      <path d="M210 90 L220 65 L218 88 Z" fill="#FBBF24"/>
      <path d="M180 165 Q205 182 220 165" fill="none"/>
      <circle cx="202" cy="162" r="10" fill="#FDE68A"/>
      <circle cx="205" cy="160" r="2" fill="#1E293B"/>
      <circle cx="212" cy="104" r="3" fill="#1E293B"/>
    `,
  },
  chameleon: {
    accent: '#10B981',
    body: `
      <line x1="75" y1="210" x2="325" y2="210" stroke="#78350F" stroke-width="8"/>
      <path d="M135 205 C135 140 225 135 245 185 Z" fill="#34D399"/>
      <path d="M240 175 L275 155 L268 192 Z" fill="#34D399"/>
      <circle cx="255" cy="172" r="9" fill="#FEF08A"/>
      <circle cx="255" cy="172" r="3" fill="#1E293B"/>
      <path d="M135 198 C102 198 95 162 118 162 C132 162 132 182 118 182" fill="none" stroke="#10B981" stroke-width="6"/>
      <path d="M274 176 Q315 170 338 145" stroke="#FB7185" stroke-width="4" stroke-dasharray="4 2"/>
      <circle cx="342" cy="142" r="5" fill="#1E293B"/>
    `,
  },
  porcupine: {
    accent: '#92400E',
    body: `
      <path d="M125 205 C125 145 245 145 265 205 Z" fill="#D97706"/>
      <circle cx="252" cy="185" r="4" fill="#1E293B"/>
      <circle cx="268" cy="195" r="5" fill="#1E293B"/>
      <line x1="130" y1="175" x2="95" y2="145"/>
      <line x1="145" y1="162" x2="112" y2="122"/>
      <line x1="165" y1="155" x2="142" y2="108"/>
      <line x1="185" y1="152" x2="175" y2="102"/>
      <line x1="205" y1="155" x2="205" y2="106"/>
      <line x1="222" y1="162" x2="232" y2="115"/>
      <line x1="125" y1="192" x2="88" y2="175"/>
    `,
  },
  platypus: {
    accent: '#0D9488',
    body: `
      <ellipse cx="195" cy="168" rx="58" ry="30" fill="#A16207"/>
      <path d="M248 162 C288 154 292 182 248 178 Z" fill="#FBBF24"/>
      <path d="M138 168 C90 148 88 192 138 175 Z" fill="#78350F"/>
      <line x1="105" y1="162" x2="122" y2="178" stroke-width="2"/>
      <line x1="122" y1="160" x2="105" y2="176" stroke-width="2"/>
      <circle cx="236" cy="158" r="3.5" fill="#1E293B"/>
      <path d="M170 198 L162 215 L180 215 Z" fill="#FBBF24"/>
      <path d="M218 198 L210 215 L228 215 Z" fill="#FBBF24"/>
    `,
  },
  narwhal: {
    accent: '#0284C7',
    body: `
      <path d="M125 175 C135 125 225 125 245 168 C225 195 145 195 125 175 Z" fill="#7DD3FC"/>
      <path d="M125 175 L95 152 L102 175 L92 196 Z" fill="#38BDF8"/>
      <path d="M242 152 L332 102" stroke="#FEF08A" stroke-width="6"/>
      <path d="M242 152 L332 102" stroke="#1E293B" stroke-width="3"/>
      <circle cx="226" cy="160" r="3.5" fill="#1E293B"/>
      <path d="M85 215 Q140 200 195 215 T310 215" stroke="#0284C7" stroke-width="3"/>
    `,
  },

  // FOOD AND DRINKS
  pizza: {
    accent: '#EF4444',
    body: `
      <path d="M200 65 L110 225 Q200 250 290 225 Z" fill="#FDE047"/>
      <path d="M105 220 Q200 248 295 220" stroke="#D97706" stroke-width="16"/>
      <path d="M105 220 Q200 248 295 220" stroke="#1E293B" stroke-width="4"/>
      <circle cx="198" cy="135" r="14" fill="#EF4444"/>
      <circle cx="168" cy="182" r="15" fill="#EF4444"/>
      <circle cx="225" cy="188" r="14" fill="#EF4444"/>
      <circle cx="195" cy="208" r="11" fill="#EF4444"/>
    `,
  },
  'ice cream cone': {
    accent: '#EC4899',
    body: `
      <polygon points="160,155 240,155 200,258" fill="#FBBF24"/>
      <line x1="172" y1="155" x2="212" y2="225" stroke-width="2"/>
      <line x1="228" y1="155" x2="188" y2="225" stroke-width="2"/>
      <circle cx="200" cy="132" r="38" fill="#F472B6"/>
      <circle cx="200" cy="88" r="30" fill="#FEF08A"/>
      <circle cx="200" cy="54" r="9" fill="#EF4444"/>
      <path d="M200 45 Q214 30 224 38" fill="none"/>
    `,
  },
  cupcake: {
    accent: '#F43F5E',
    body: `
      <polygon points="145,165 255,165 238,242 162,242" fill="#38BDF8"/>
      <line x1="175" y1="165" x2="180" y2="242" stroke-width="2.5"/>
      <line x1="200" y1="165" x2="200" y2="242" stroke-width="2.5"/>
      <line x1="225" y1="165" x2="220" y2="242" stroke-width="2.5"/>
      <path d="M138 165 C130 132 270 132 262 165 Z" fill="#F9A8D4"/>
      <path d="M155 138 C155 106 245 106 245 138 Z" fill="#F472B6"/>
      <circle cx="200" cy="95" r="10" fill="#EF4444"/>
    `,
  },
  spaghetti: {
    accent: '#EA580C',
    body: `
      <ellipse cx="200" cy="215" rx="95" ry="26" fill="#E2E8F0"/>
      <path d="M132 205 C145 155 255 155 268 205 Z" fill="#FDE047"/>
      <path d="M148 195 Q175 165 205 195 T252 190" fill="none" stroke="#F59E0B" stroke-width="4"/>
      <circle cx="172" cy="182" r="13" fill="#9A3412"/>
      <circle cx="215" cy="176" r="14" fill="#9A3412"/>
      <circle cx="195" cy="198" r="12" fill="#9A3412"/>
      <line x1="275" y1="72" x2="215" y2="132" stroke-width="5"/>
      <path d="M205 125 L225 142" stroke-width="4"/>
    `,
  },
  'bubble tea': {
    accent: '#A855F7',
    body: `
      <polygon points="152,95 248,95 234,242 166,242" fill="#F3E8FF"/>
      <line x1="144" y1="95" x2="256" y2="95" stroke-width="6"/>
      <line x1="215" y1="45" x2="188" y2="232" stroke="#EC4899" stroke-width="12"/>
      <line x1="215" y1="45" x2="188" y2="232" stroke="#1E293B" stroke-width="3"/>
      <circle cx="178" cy="226" r="6" fill="#1E293B"/>
      <circle cx="196" cy="228" r="6" fill="#1E293B"/>
      <circle cx="215" cy="225" r="6" fill="#1E293B"/>
      <circle cx="186" cy="210" r="6" fill="#1E293B"/>
      <circle cx="208" cy="212" r="6" fill="#1E293B"/>
    `,
  },
  'sushi roll': {
    accent: '#10B981',
    body: `
      <ellipse cx="165" cy="185" rx="38" ry="22" fill="#1E293B"/>
      <rect x="127" y="145" width="76" height="40" fill="#1E293B"/>
      <ellipse cx="165" cy="145" rx="38" ry="22" fill="#FFFFFF"/>
      <circle cx="165" cy="145" r="13" fill="#FB7185"/>
      <line x1="220" y1="75" x2="155" y2="135" stroke="#B45309" stroke-width="6"/>
      <line x1="245" y1="92" x2="168" y2="150" stroke="#B45309" stroke-width="6"/>
    `,
  },
  'eggs benedict': {
    accent: '#F59E0B',
    body: `
      <ellipse cx="200" cy="218" rx="95" ry="22" fill="#F1F5F9"/>
      <rect x="135" y="178" width="55" height="24" rx="10" fill="#FDE68A"/>
      <rect x="210" y="178" width="55" height="24" rx="10" fill="#FDE68A"/>
      <path d="M135 178 C135 138 190 138 190 178 Z" fill="#FFFFFF"/>
      <path d="M210 178 C210 138 265 138 265 178 Z" fill="#FFFFFF"/>
      <path d="M132 162 Q162 185 192 162" fill="#FACC15"/>
      <path d="M208 162 Q238 185 268 162" fill="#FACC15"/>
    `,
  },
  'charcuterie board': {
    accent: '#B45309',
    body: `
      <rect x="95" y="95" width="190" height="120" rx="16" fill="#FCD34D"/>
      <rect x="285" y="138" width="38" height="32" rx="10" fill="#FCD34D"/>
      <polygon points="118,125 168,115 158,162" fill="#FEF08A"/>
      <circle cx="145" cy="138" r="3" fill="#B45309"/>
      <circle cx="205" cy="132" r="16" fill="#E11D48"/>
      <circle cx="222" cy="145" r="16" fill="#E11D48"/>
      <circle cx="248" cy="178" r="7" fill="#7C3AED"/>
      <circle cx="260" cy="178" r="7" fill="#7C3AED"/>
      <circle cx="254" cy="190" r="7" fill="#7C3AED"/>
    `,
  },

  // OBJECTS
  umbrella: {
    accent: '#3B82F6',
    body: `
      <path d="M105 155 C105 75 295 75 295 155 Q262 140 232 155 Q200 140 168 155 Q138 140 105 155 Z" fill="#60A5FA"/>
      <line x1="200" y1="82" x2="200" y2="232" stroke-width="5"/>
      <path d="M200 232 C200 254 172 254 172 234" fill="none" stroke-width="5"/>
      <line x1="135" y1="58" x2="128" y2="75" stroke="#38BDF8" stroke-width="3"/>
      <line x1="265" y1="58" x2="258" y2="75" stroke="#38BDF8" stroke-width="3"/>
    `,
  },
  scissors: {
    accent: '#EF4444',
    body: `
      <line x1="145" y1="215" x2="258" y2="78" stroke-width="7"/>
      <line x1="255" y1="215" x2="142" y2="78" stroke-width="7"/>
      <circle cx="200" cy="148" r="6" fill="#94A3B8"/>
      <circle cx="135" cy="228" r="24" stroke="#EF4444" stroke-width="8" fill="none"/>
      <circle cx="265" cy="228" r="24" stroke="#EF4444" stroke-width="8" fill="none"/>
    `,
  },
  backpack: {
    accent: '#6366F1',
    body: `
      <path d="M180 72 Q200 50 220 72" fill="none" stroke-width="5"/>
      <rect x="135" y="75" width="130" height="162" rx="34" fill="#818CF8"/>
      <rect x="155" y="152" width="90" height="65" rx="16" fill="#FCD34D"/>
      <line x1="165" y1="172" x2="235" y2="172" stroke-dasharray="5 5"/>
      <path d="M135 98 C105 110 105 205 135 215" fill="none" stroke-width="6"/>
      <path d="M265 98 C295 110 295 205 265 215" fill="none" stroke-width="6"/>
    `,
  },
  hourglass: {
    accent: '#F59E0B',
    body: `
      <rect x="135" y="55" width="130" height="14" rx="4" fill="#92400E"/>
      <rect x="135" y="232" width="130" height="14" rx="4" fill="#92400E"/>
      <line x1="148" y1="69" x2="148" y2="232"/>
      <line x1="252" y1="69" x2="252" y2="232"/>
      <path d="M158 69 C158 125 194 135 196 150 C194 165 158 175 158 232 L242 232 C242 175 206 165 204 150 C206 135 242 125 242 69 Z" fill="#E0F2FE"/>
      <polygon points="175,112 225,112 200,145" fill="#FBBF24" stroke="none"/>
      <line x1="200" y1="148" x2="200" y2="215" stroke="#FBBF24" stroke-width="4" stroke-dasharray="4 4"/>
      <path d="M164 230 Q200 192 236 230 Z" fill="#FBBF24"/>
    `,
  },
  chandelier: {
    accent: '#EAB308',
    body: `
      <line x1="200" y1="35" x2="200" y2="115" stroke-width="4"/>
      <path d="M200 115 C165 155 120 155 120 125" fill="none"/>
      <path d="M200 115 C235 155 280 155 280 125" fill="none"/>
      <path d="M200 135 C175 175 150 175 150 145" fill="none"/>
      <path d="M200 135 C225 175 250 175 250 145" fill="none"/>
      <circle cx="120" cy="112" r="7" fill="#FEF08A"/>
      <circle cx="150" cy="132" r="7" fill="#FEF08A"/>
      <circle cx="250" cy="132" r="7" fill="#FEF08A"/>
      <circle cx="280" cy="112" r="7" fill="#FEF08A"/>
      <polygon points="200,165 190,188 200,205 210,188" fill="#BAE6FD"/>
    `,
  },
  telescope: {
    accent: '#4F46E5',
    body: `
      <g transform="rotate(-24 200 140)">
        <rect x="125" y="125" width="150" height="28" rx="6" fill="#60A5FA"/>
        <rect x="265" y="118" width="24" height="42" rx="4" fill="#FBBF24"/>
      </g>
      <line x1="195" y1="152" x2="145" y2="245"/>
      <line x1="195" y1="152" x2="195" y2="250"/>
      <line x1="195" y1="152" x2="245" y2="245"/>
      <circle cx="315" cy="68" r="14" fill="#FEF08A"/>
    `,
  },
  'sewing machine': {
    accent: '#06B6D4',
    body: `
      <rect x="105" y="210" width="190" height="24" rx="8" fill="#67E8F9"/>
      <path d="M265 210 L265 105 L145 105 L145 155 L175 155 L175 135 L230 135 L230 210 Z" fill="#22D3EE"/>
      <line x1="160" y1="155" x2="160" y2="198" stroke-width="3"/>
      <rect x="215" y="75" width="18" height="30" fill="#F43F5E"/>
      <path d="M115 202 Q160 192 215 204" stroke="#A855F7" stroke-width="4" stroke-dasharray="6 4"/>
    `,
  },
  kaleidoscope: {
    accent: '#EC4899',
    body: `
      <circle cx="200" cy="150" r="82" fill="#FDF2F8"/>
      <line x1="200" y1="68" x2="200" y2="232"/>
      <line x1="118" y1="150" x2="282" y2="150"/>
      <line x1="142" y1="92" x2="258" y2="208"/>
      <line x1="258" y1="92" x2="142" y2="208"/>
      <polygon points="200,95 218,132 255,150 218,168 200,205 182,168 145,150 182,132" fill="#F472B6"/>
      <circle cx="200" cy="150" r="18" fill="#FACC15"/>
    `,
  },

  // MOVIES AND CHARACTERS
  superhero: {
    accent: '#EF4444',
    body: `
      <path d="M165 125 L105 225 L195 205 Z" fill="#EF4444"/>
      <circle cx="215" cy="95" r="22" fill="#FDE68A"/>
      <rect x="198" y="88" width="34" height="10" rx="5" fill="#1E293B"/>
      <polygon points="185,120 245,120 232,188 198,188" fill="#3B82F6"/>
      <polygon points="215,135 228,150 215,165 202,150" fill="#FACC15"/>
      <line x1="242" y1="125" x2="282" y2="75" stroke-width="6"/>
    `,
  },
  'pirate captain': {
    accent: '#1E293B',
    body: `
      <circle cx="200" cy="135" r="34" fill="#FDE68A"/>
      <path d="M142 115 Q200 62 258 115 Z" fill="#1E293B"/>
      <circle cx="186" cy="132" r="8" fill="#1E293B"/>
      <line x1="168" y1="120" x2="225" y2="138" stroke-width="3"/>
      <circle cx="214" cy="132" r="3" fill="#1E293B"/>
      <path d="M188 152 Q200 162 214 152" fill="none"/>
      <path d="M255 195 C278 195 278 165 258 165" fill="none" stroke="#94A3B8" stroke-width="6"/>
    `,
  },
  wizard: {
    accent: '#7C3AED',
    body: `
      <polygon points="200,45 148,125 252,125" fill="#7C3AED"/>
      <ellipse cx="200" cy="125" rx="64" ry="12" fill="#7C3AED"/>
      <circle cx="200" cy="148" r="24" fill="#FDE68A"/>
      <path d="M178 158 L200 242 L222 158 Z" fill="#F8FAFC"/>
      <line x1="272" y1="95" x2="255" y2="238" stroke="#92400E" stroke-width="6"/>
      <circle cx="274" cy="88" r="12" fill="#FEF08A"/>
    `,
  },
  detective: {
    accent: '#B45309',
    body: `
      <path d="M135 115 Q190 75 245 115 Z" fill="#B45309"/>
      <ellipse cx="190" cy="115" rx="68" ry="10" fill="#92400E"/>
      <circle cx="190" cy="145" r="26" fill="#FDE68A"/>
      <circle cx="248" cy="155" r="28" fill="#BAE6FD" fill-opacity="0.6"/>
      <line x1="268" y1="175" x2="295" y2="208" stroke-width="8"/>
      <circle cx="248" cy="155" r="8" fill="#1E293B"/>
    `,
  },
  'time traveler': {
    accent: '#8B5CF6',
    body: `
      <circle cx="200" cy="150" r="78" stroke="#8B5CF6" stroke-width="5" stroke-dasharray="12 6"/>
      <circle cx="200" cy="150" r="52" fill="#EDE9FE"/>
      <line x1="200" y1="150" x2="200" y2="112" stroke-width="4"/>
      <line x1="200" y1="150" x2="232" y2="150" stroke-width="4"/>
      <path d="M115 95 L135 115 L122 122 L145 142" stroke="#FACC15" stroke-width="4"/>
      <path d="M285 95 L265 115 L278 122 L255 142" stroke="#FACC15" stroke-width="4"/>
    `,
  },
  'silent film actor': {
    accent: '#334155',
    body: `
      <rect x="95" y="55" width="210" height="190" rx="8" fill="#F1F5F9"/>
      <path d="M168 112 C168 82 232 82 232 112 Z" fill="#1E293B"/>
      <line x1="152" y1="112" x2="248" y2="112" stroke-width="6"/>
      <circle cx="200" cy="138" r="24" fill="#FFFFFF"/>
      <rect x="192" y="144" width="16" height="6" fill="#1E293B"/>
      <path d="M242 155 L262 225" stroke-width="4"/>
    `,
  },

  // PLACES
  lighthouse: {
    accent: '#EF4444',
    body: `
      <polygon points="175,85 225,85 240,235 160,235" fill="#FFFFFF"/>
      <polygon points="171,125 229,125 233,165 167,165" fill="#EF4444"/>
      <rect x="180" y="58" width="40" height="27" fill="#FEF08A"/>
      <polygon points="172,58 228,58 200,36" fill="#EF4444"/>
      <polygon points="220,65 340,35 340,95" fill="#FEF08A" fill-opacity="0.55" stroke="none"/>
      <polygon points="180,65 60,35 60,95" fill="#FEF08A" fill-opacity="0.55" stroke="none"/>
      <path d="M90 238 Q145 222 200 238 T310 238" stroke="#0284C7" stroke-width="5"/>
    `,
  },
  castle: {
    accent: '#6366F1',
    body: `
      <rect x="115" y="105" width="45" height="130" fill="#CBD5E1"/>
      <rect x="240" y="105" width="45" height="130" fill="#CBD5E1"/>
      <rect x="160" y="138" width="80" height="97" fill="#E2E8F0"/>
      <polygon points="110,105 165,105 137,62" fill="#6366F1"/>
      <polygon points="235,105 290,105 262,62" fill="#6366F1"/>
      <path d="M180 235 L180 188 C180 168 220 168 220 188 L220 235 Z" fill="#78350F"/>
    `,
  },
  treehouse: {
    accent: '#16A34A',
    body: `
      <rect x="180" y="155" width="40" height="95" fill="#78350F"/>
      <circle cx="200" cy="115" r="68" fill="#4ADE80"/>
      <rect x="158" y="105" width="84" height="58" fill="#FBBF24"/>
      <polygon points="148,105 252,105 200,68" fill="#B45309"/>
      <line x1="215" y1="163" x2="215" y2="245" stroke-width="3"/>
      <line x1="232" y1="163" x2="232" y2="245" stroke-width="3"/>
      <line x1="215" y1="185" x2="232" y2="185" stroke-width="3"/>
      <line x1="215" y1="210" x2="232" y2="210" stroke-width="3"/>
    `,
  },
  'roller coaster': {
    accent: '#E11D48',
    body: `
      <path d="M75 215 Q125 95 175 195 C215 245 265 185 235 125 C205 65 155 125 185 185 Q245 235 325 135" fill="none" stroke="#E11D48" stroke-width="5"/>
      <line x1="125" y1="152" x2="125" y2="240" stroke="#94A3B8" stroke-width="2"/>
      <line x1="205" y1="95" x2="205" y2="240" stroke="#94A3B8" stroke-width="2"/>
      <line x1="295" y1="165" x2="295" y2="240" stroke="#94A3B8" stroke-width="2"/>
    `,
  },
  observatory: {
    accent: '#3B82F6',
    body: `
      <path d="M85 245 Q200 195 315 245 Z" fill="#86EFAC"/>
      <path d="M135 218 C135 132 265 132 265 218 Z" fill="#F8FAFC"/>
      <rect x="215" y="115" width="65" height="22" rx="4" transform="rotate(-28 215 115)" fill="#60A5FA"/>
      <circle cx="305" cy="68" r="8" fill="#FEF08A"/>
      <circle cx="115" cy="82" r="6" fill="#FEF08A"/>
    `,
  },
  'drive-in theater': {
    accent: '#6366F1',
    body: `
      <rect x="110" y="55" width="180" height="95" rx="6" fill="#BAE6FD"/>
      <line x1="150" y1="150" x2="150" y2="180"/>
      <line x1="250" y1="150" x2="250" y2="180"/>
      <rect x="115" y="198" width="68" height="34" rx="10" fill="#F43F5E"/>
      <rect x="218" y="198" width="68" height="34" rx="10" fill="#3B82F6"/>
    `,
  },

  // SPORTS
  basketball: {
    accent: '#EA580C',
    body: `
      <rect x="125" y="55" width="150" height="95" rx="6" fill="#F8FAFC"/>
      <line x1="160" y1="132" x2="240" y2="132" stroke="#EF4444" stroke-width="6"/>
      <polygon points="168,132 232,132 218,188 182,188" fill="none" stroke-dasharray="5 5"/>
      <circle cx="200" cy="218" r="32" fill="#F97316"/>
      <path d="M168 218 L232 218" fill="none"/>
      <path d="M200 186 L200 250" fill="none"/>
    `,
  },
  bowling: {
    accent: '#EF4444',
    body: `
      <circle cx="145" cy="195" r="40" fill="#334155"/>
      <circle cx="155" cy="180" r="4" fill="#FFFFFF"/>
      <circle cx="166" cy="190" r="4" fill="#FFFFFF"/>
      <circle cx="150" cy="195" r="4" fill="#FFFFFF"/>
      <path d="M245 105 C235 135 228 165 235 205 L265 205 C272 165 265 135 255 105 Z" fill="#FFFFFF"/>
      <line x1="236" y1="138" x2="264" y2="138" stroke="#EF4444" stroke-width="5"/>
    `,
  },
  archery: {
    accent: '#EF4444',
    body: `
      <circle cx="245" cy="150" r="58" fill="#EF4444"/>
      <circle cx="245" cy="150" r="38" fill="#38BDF8"/>
      <circle cx="245" cy="150" r="18" fill="#FACC15"/>
      <line x1="105" y1="150" x2="245" y2="150" stroke-width="5"/>
      <polygon points="245,150 228,142 228,158" fill="#1E293B"/>
    `,
  },
  surfing: {
    accent: '#0284C7',
    body: `
      <path d="M85 215 C115 95 245 85 285 155 C235 145 195 185 225 225 Z" fill="#38BDF8"/>
      <ellipse cx="215" cy="182" rx="52" ry="14" transform="rotate(-18 215 182)" fill="#FACC15"/>
      <circle cx="210" cy="118" r="12" fill="#FDE68A"/>
      <line x1="210" y1="130" x2="210" y2="162"/>
      <line x1="185" y1="142" x2="235" y2="135"/>
    `,
  },
  'pole vault': {
    accent: '#F59E0B',
    body: `
      <line x1="265" y1="65" x2="265" y2="242"/>
      <line x1="230" y1="95" x2="300" y2="95" stroke="#EF4444" stroke-width="5"/>
      <path d="M125 240 Q145 110 245 78" fill="none" stroke="#F59E0B" stroke-width="5"/>
      <circle cx="255" cy="70" r="10" fill="#FDE68A"/>
    `,
  },
  'synchronized swimming': {
    accent: '#06B6D4',
    body: `
      <path d="M75 195 Q138 178 200 195 T325 195" stroke="#0284C7" stroke-width="6"/>
      <path d="M145 192 L162 115 L182 122" fill="none" stroke-width="7"/>
      <path d="M215 192 L232 115 L252 122" fill="none" stroke-width="7"/>
    `,
  },

  // NATURE
  volcano: {
    accent: '#EF4444',
    body: `
      <polygon points="105,238 168,118 232,118 295,238" fill="#78350F"/>
      <path d="M168 118 Q185 155 178 190 Q200 155 215 182 Q222 145 232 118 Z" fill="#EF4444"/>
      <circle cx="200" cy="75" r="32" fill="#94A3B8"/>
      <circle cx="172" cy="82" r="22" fill="#CBD5E1"/>
      <circle cx="228" cy="82" r="22" fill="#CBD5E1"/>
    `,
  },
  rainbow: {
    accent: '#EC4899',
    body: `
      <path d="M95 205 A105 105 0 0 1 305 205" stroke="#EF4444" stroke-width="12" fill="none"/>
      <path d="M110 205 A90 90 0 0 1 290 205" stroke="#FACC15" stroke-width="12" fill="none"/>
      <path d="M125 205 A75 75 0 0 1 275 205" stroke="#4ADE80" stroke-width="12" fill="none"/>
      <path d="M140 205 A60 60 0 0 1 260 205" stroke="#38BDF8" stroke-width="12" fill="none"/>
      <circle cx="105" cy="208" r="24" fill="#FFFFFF"/>
      <circle cx="295" cy="208" r="24" fill="#FFFFFF"/>
    `,
  },
  waterfall: {
    accent: '#0EA5E9',
    body: `
      <rect x="85" y="85" width="75" height="150" fill="#78350F"/>
      <rect x="240" y="85" width="75" height="150" fill="#78350F"/>
      <rect x="160" y="85" width="80" height="150" fill="#38BDF8"/>
      <line x1="180" y1="95" x2="180" y2="215" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="10 6"/>
      <line x1="205" y1="105" x2="205" y2="215" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="10 6"/>
      <circle cx="175" cy="228" r="16" fill="#E0F2FE"/>
      <circle cx="200" cy="225" r="20" fill="#E0F2FE"/>
      <circle cx="225" cy="228" r="16" fill="#E0F2FE"/>
    `,
  },
  tornado: {
    accent: '#64748B',
    body: `
      <ellipse cx="200" cy="78" rx="85" ry="20" fill="#94A3B8"/>
      <ellipse cx="195" cy="115" rx="64" ry="16" fill="#94A3B8"/>
      <ellipse cx="205" cy="152" rx="44" ry="13" fill="#CBD5E1"/>
      <ellipse cx="196" cy="188" rx="26" ry="10" fill="#CBD5E1"/>
      <ellipse cx="202" cy="222" rx="12" ry="6" fill="#E2E8F0"/>
    `,
  },
  'venus flytrap': {
    accent: '#16A34A',
    body: `
      <polygon points="155,188 245,188 232,245 168,245" fill="#D97706"/>
      <path d="M200 188 Q185 140 210 112" fill="none" stroke="#16A34A" stroke-width="8"/>
      <path d="M175 95 C175 62 248 62 248 95 Z" fill="#4ADE80"/>
      <path d="M175 112 C175 145 248 145 248 112 Z" fill="#4ADE80"/>
      <circle cx="275" cy="82" r="5" fill="#1E293B"/>
    `,
  },
  'aurora borealis': {
    accent: '#10B981',
    body: `
      <path d="M85 125 Q145 65 205 125 T325 115" stroke="#34D399" stroke-width="18" fill="none"/>
      <path d="M85 155 Q145 95 205 155 T325 145" stroke="#A855F7" stroke-width="12" fill="none"/>
      <polygon points="95,240 155,175 215,240" fill="#E2E8F0"/>
      <polygon points="185,240 255,165 315,240" fill="#CBD5E1"/>
    `,
  },

  // ACTIONS
  'jump rope': {
    accent: '#EC4899',
    body: `
      <path d="M135 165 C135 45 265 45 265 165" fill="none" stroke="#EC4899" stroke-width="5" stroke-dasharray="8 4"/>
      <circle cx="200" cy="122" r="18" fill="#FDE68A"/>
      <line x1="200" y1="140" x2="200" y2="188" stroke-width="5"/>
      <line x1="135" y1="165" x2="265" y2="165" stroke-width="5"/>
      <line x1="200" y1="188" x2="182" y2="215" stroke-width="5"/>
      <line x1="200" y1="188" x2="218" y2="215" stroke-width="5"/>
    `,
  },
  fishing: {
    accent: '#0284C7',
    body: `
      <path d="M95 195 Q185 85 265 95" fill="none" stroke="#92400E" stroke-width="5"/>
      <line x1="265" y1="95" x2="265" y2="205" stroke-width="2.5"/>
      <path d="M265 205 C265 218 252 218 252 205" fill="none" stroke-width="3"/>
      <ellipse cx="225" cy="215" rx="22" ry="12" fill="#FB923C"/>
      <polygon points="203,215 188,204 188,226" fill="#FB923C"/>
    `,
  },
  juggling: {
    accent: '#F59E0B',
    body: `
      <circle cx="132" cy="145" r="13" fill="#EF4444"/>
      <circle cx="162" cy="95" r="13" fill="#FACC15"/>
      <circle cx="200" cy="75" r="13" fill="#4ADE80"/>
      <circle cx="238" cy="95" r="13" fill="#38BDF8"/>
      <circle cx="268" cy="145" r="13" fill="#A855F7"/>
      <circle cx="200" cy="175" r="22" fill="#FDE68A"/>
      <path d="M145 225 L175 198 L225 198 L255 225" fill="none" stroke-width="5"/>
    `,
  },
  'tightrope walking': {
    accent: '#6366F1',
    body: `
      <line x1="65" y1="215" x2="335" y2="215" stroke-width="4"/>
      <circle cx="200" cy="102" r="16" fill="#FDE68A"/>
      <line x1="200" y1="118" x2="200" y2="172" stroke-width="5"/>
      <line x1="105" y1="145" x2="295" y2="145" stroke="#EF4444" stroke-width="6"/>
      <line x1="200" y1="172" x2="200" y2="215" stroke-width="5"/>
    `,
  },
  sleepwalking: {
    accent: '#6366F1',
    body: `
      <circle cx="175" cy="115" r="22" fill="#FDE68A"/>
      <line x1="178" y1="112" x2="188" y2="112" stroke-width="3"/>
      <line x1="175" y1="137" x2="175" y2="198" stroke-width="5"/>
      <line x1="175" y1="152" x2="245" y2="152" stroke-width="5"/>
      <line x1="175" y1="198" x2="155" y2="240" stroke-width="5"/>
      <line x1="175" y1="198" x2="198" y2="240" stroke-width="5"/>
      <circle cx="255" cy="78" r="18" fill="#FEF08A"/>
    `,
  },
  'parallel parking': {
    accent: '#3B82F6',
    body: `
      <rect x="245" y="45" width="48" height="65" rx="10" fill="#94A3B8"/>
      <rect x="245" y="192" width="48" height="65" rx="10" fill="#94A3B8"/>
      <rect x="135" y="105" width="48" height="65" rx="10" transform="rotate(-24 159 137)" fill="#3B82F6"/>
      <path d="M185 135 Q235 135 265 152" fill="none" stroke="#EF4444" stroke-width="4" stroke-dasharray="6 4"/>
    `,
  },

  // PROFESSIONS
  chef: {
    accent: '#F59E0B',
    body: `
      <circle cx="178" cy="82" r="20" fill="#FFFFFF"/>
      <circle cx="200" cy="72" r="24" fill="#FFFFFF"/>
      <circle cx="222" cy="82" r="20" fill="#FFFFFF"/>
      <rect x="172" y="92" width="56" height="32" fill="#FFFFFF"/>
      <circle cx="200" cy="152" r="28" fill="#FDE68A"/>
      <line x1="245" y1="195" x2="315" y2="195" stroke-width="8"/>
      <ellipse cx="275" cy="152" rx="22" ry="8" fill="#FBBF24"/>
    `,
  },
  firefighter: {
    accent: '#EF4444',
    body: `
      <path d="M135 125 C135 88 205 88 205 125 Z" fill="#EF4444"/>
      <line x1="122" y1="125" x2="218" y2="125" stroke-width="6"/>
      <circle cx="170" cy="152" r="24" fill="#FDE68A"/>
      <path d="M195 188 L265 162" stroke="#38BDF8" stroke-width="8"/>
      <path d="M285 220 C270 180 295 155 305 135 C318 160 332 185 315 220 Z" fill="#F97316"/>
    `,
  },
  astronaut: {
    accent: '#6366F1',
    body: `
      <rect x="155" y="135" width="90" height="88" rx="20" fill="#F8FAFC"/>
      <circle cx="200" cy="108" r="38" fill="#F8FAFC"/>
      <ellipse cx="200" cy="108" rx="26" ry="20" fill="#1E293B"/>
      <circle cx="305" cy="78" r="18" fill="#FBBF24"/>
      <ellipse cx="305" cy="78" rx="32" ry="7" fill="none"/>
    `,
  },
  beekeeper: {
    accent: '#EAB308',
    body: `
      <ellipse cx="170" cy="95" rx="48" ry="12" fill="#FDE047"/>
      <rect x="138" y="95" width="64" height="52" fill="#E2E8F0" fill-opacity="0.7"/>
      <ellipse cx="275" cy="165" rx="34" ry="42" fill="#FBBF24"/>
      <line x1="244" y1="152" x2="306" y2="152"/>
      <line x1="244" y1="175" x2="306" y2="175"/>
      <circle cx="232" cy="115" r="7" fill="#FACC15"/>
    `,
  },
  archaeologist: {
    accent: '#B45309',
    body: `
      <path d="M95 215 L305 215" stroke="#92400E" stroke-width="6"/>
      <circle cx="155" cy="165" r="24" fill="#F8FAFC"/>
      <line x1="185" y1="175" x2="245" y2="175" stroke-width="6"/>
      <line x1="198" y1="160" x2="198" y2="195" stroke-width="5"/>
      <line x1="215" y1="160" x2="215" y2="195" stroke-width="5"/>
      <line x1="232" y1="160" x2="232" y2="195" stroke-width="5"/>
    `,
  },
  'air traffic controller': {
    accent: '#0284C7',
    body: `
      <polygon points="165,125 235,125 220,78 180,78" fill="#BAE6FD"/>
      <rect x="182" y="125" width="36" height="115" fill="#CBD5E1"/>
      <path d="M85 95 L135 82 L115 105 Z" fill="#38BDF8"/>
    `,
  },

  // TECHNOLOGY
  robot: {
    accent: '#3B82F6',
    body: `
      <line x1="200" y1="45" x2="200" y2="75"/>
      <circle cx="200" cy="42" r="8" fill="#EF4444"/>
      <rect x="155" y="75" width="90" height="68" rx="12" fill="#94A3B8"/>
      <circle cx="180" cy="108" r="10" fill="#FEF08A"/>
      <circle cx="220" cy="108" r="10" fill="#FEF08A"/>
      <rect x="142" y="148" width="116" height="88" rx="14" fill="#CBD5E1"/>
      <rect x="168" y="172" width="64" height="32" rx="6" fill="#38BDF8"/>
    `,
  },
  headphones: {
    accent: '#8B5CF6',
    body: `
      <path d="M125 175 C125 65 275 65 275 175" fill="none" stroke-width="10"/>
      <rect x="105" y="152" width="34" height="64" rx="16" fill="#8B5CF6"/>
      <rect x="261" y="152" width="34" height="64" rx="16" fill="#8B5CF6"/>
      <circle cx="192" cy="168" r="8" fill="#EC4899"/>
      <line x1="200" y1="168" x2="200" y2="132"/>
      <line x1="200" y1="132" x2="218" y2="138"/>
    `,
  },
  drone: {
    accent: '#0EA5E9',
    body: `
      <line x1="120" y1="115" x2="280" y2="185" stroke-width="6"/>
      <line x1="280" y1="115" x2="120" y2="185" stroke-width="6"/>
      <rect x="168" y="132" width="64" height="36" rx="12" fill="#38BDF8"/>
      <circle cx="200" cy="178" r="12" fill="#334155"/>
      <ellipse cx="120" cy="108" rx="28" ry="6" fill="#94A3B8"/>
      <ellipse cx="280" cy="108" rx="28" ry="6" fill="#94A3B8"/>
      <ellipse cx="120" cy="192" rx="28" ry="6" fill="#94A3B8"/>
      <ellipse cx="280" cy="192" rx="28" ry="6" fill="#94A3B8"/>
    `,
  },
  'virtual reality headset': {
    accent: '#6366F1',
    body: `
      <circle cx="200" cy="150" r="52" fill="#FDE68A"/>
      <rect x="142" y="118" width="116" height="48" rx="16" fill="#4F46E5"/>
      <rect x="155" y="128" width="90" height="28" rx="10" fill="#38BDF8"/>
    `,
  },
  '3d printer': {
    accent: '#F97316',
    body: `
      <rect x="120" y="60" width="160" height="180" rx="8" fill="none" stroke-width="6"/>
      <line x1="120" y1="115" x2="280" y2="115" stroke-width="4"/>
      <polygon points="188,115 212,115 200,145" fill="#F97316"/>
      <rect x="172" y="185" width="56" height="35" fill="#38BDF8"/>
      <line x1="145" y1="220" x2="255" y2="220" stroke-width="6"/>
    `,
  },
  'solar panel': {
    accent: '#EAB308',
    body: `
      <polygon points="125,145 255,115 285,205 105,225" fill="#2563EB"/>
      <line x1="185" y1="130" x2="195" y2="215" stroke="#93C5FD" stroke-width="2.5"/>
      <line x1="115" y1="182" x2="270" y2="160" stroke="#93C5FD" stroke-width="2.5"/>
      <circle cx="115" cy="78" r="24" fill="#FACC15"/>
    `,
  },

  // ADDITIONAL CORE PICTIONARY WORDS
  dog: {
    accent: '#D97706',
    body: `
      <!-- Dog sitting body and legs -->
      <ellipse cx="185" cy="182" rx="52" ry="36" fill="#FBBF24"/>
      <rect x="142" y="198" width="16" height="44" rx="8" fill="#F59E0B"/>
      <rect x="168" y="202" width="16" height="42" rx="8" fill="#FBBF24"/>
      <rect x="208" y="200" width="16" height="44" rx="8" fill="#FBBF24"/>
      <!-- Wagging tail with motion lines -->
      <path d="M135 170 Q102 142 112 115" fill="none" stroke="#F59E0B" stroke-width="10"/>
      <path d="M135 170 Q102 142 112 115" fill="none" stroke-width="4"/>
      <path d="M96 132 Q88 120 98 108" fill="none" stroke="#94A3B8" stroke-width="2.5"/>
      <path d="M124 128 Q132 116 124 104" fill="none" stroke="#94A3B8" stroke-width="2.5"/>
      <!-- Head, snout, floppy ear, and collar -->
      <circle cx="235" cy="132" r="32" fill="#FBBF24"/>
      <ellipse cx="264" cy="138" rx="18" ry="13" fill="#FDE68A"/>
      <circle cx="276" cy="134" r="6" fill="#1E293B"/>
      <ellipse cx="216" cy="142" rx="12" ry="26" transform="rotate(14 216 142)" fill="#B45309"/>
      <circle cx="246" cy="124" r="4" fill="#1E293B"/>
      <path d="M210 156 L252 166" stroke="#EF4444" stroke-width="8"/>
      <circle cx="236" cy="172" r="7" fill="#FACC15"/>
    `,
  },
  apple: {
    accent: '#EF4444',
    body: `
      <!-- Red Apple Fruit Body -->
      <path d="M200 102 C165 78 115 105 120 162 C125 215 165 245 194 236 C200 234 200 234 206 236 C235 245 275 215 280 162 C285 105 235 78 200 102 Z" fill="#EF4444"/>
      <!-- Stem -->
      <path d="M200 104 Q204 72 218 62" fill="none" stroke="#78350F" stroke-width="7"/>
      <!-- Green Leaf -->
      <path d="M206 82 C228 62 262 72 252 94 C236 104 216 96 206 82 Z" fill="#22C55E"/>
      <!-- Shine Highlight -->
      <path d="M144 132 Q136 158 146 184" fill="none" stroke="#FECACA" stroke-width="6"/>
    `,
  },
  bicycle: {
    accent: '#2563EB',
    body: `
      <!-- Rear and Front Wheels -->
      <circle cx="125" cy="195" r="42" stroke-width="7" fill="#F8FAFC"/>
      <circle cx="125" cy="195" r="6" fill="#1E293B"/>
      <circle cx="275" cy="195" r="42" stroke-width="7" fill="#F8FAFC"/>
      <circle cx="275" cy="195" r="6" fill="#1E293B"/>
      <!-- Bicycle Diamond Frame -->
      <line x1="125" y1="195" x2="195" y2="195" stroke="#2563EB" stroke-width="6"/>
      <line x1="125" y1="195" x2="168" y2="132" stroke="#2563EB" stroke-width="6"/>
      <line x1="168" y1="132" x2="248" y2="132" stroke="#2563EB" stroke-width="6"/>
      <line x1="195" y1="195" x2="248" y2="132" stroke="#2563EB" stroke-width="6"/>
      <line x1="195" y1="195" x2="162" y2="115" stroke="#1E293B" stroke-width="5"/>
      <!-- Front Fork & Handlebars -->
      <line x1="275" y1="195" x2="242" y2="105" stroke="#1E293B" stroke-width="6"/>
      <path d="M226 105 L256 105 Q268 105 266 118" fill="none" stroke-width="6"/>
      <!-- Saddle Seat & Pedal Crank -->
      <ellipse cx="160" cy="112" rx="18" ry="6" fill="#1E293B"/>
      <circle cx="195" cy="195" r="12" fill="#FACC15"/>
      <line x1="195" y1="180" x2="195" y2="210" stroke-width="4"/>
    `,
  },
  helicopter: {
    accent: '#0284C7',
    body: `
      <!-- Tail Boom and Tail Rotor -->
      <polygon points="155,148 75,136 75,152 155,168" fill="#38BDF8"/>
      <circle cx="72" cy="144" r="18" stroke-dasharray="6 4" fill="#E0F2FE"/>
      <line x1="72" y1="126" x2="72" y2="162" stroke-width="4"/>
      <!-- Helicopter Cabin Bubble & Cockpit Window -->
      <ellipse cx="222" cy="158" rx="64" ry="42" fill="#0284C7"/>
      <path d="M232 122 C268 124 284 144 284 162 L232 162 Z" fill="#BAE6FD"/>
      <!-- Main Overhead Rotor Mast & Blades -->
      <line x1="218" y1="92" x2="218" y2="116" stroke-width="7"/>
      <line x1="105" y1="92" x2="332" y2="92" stroke-width="7"/>
      <ellipse cx="218" cy="92" rx="9" ry="5" fill="#FACC15"/>
      <!-- Landing Skids -->
      <line x1="188" y1="198" x2="182" y2="222" stroke-width="5"/>
      <line x1="252" y1="198" x2="258" y2="222" stroke-width="5"/>
      <path d="M152 222 L285 222 Q298 222 302 210" fill="none" stroke-width="6"/>
    `,
  },
  toothbrush: {
    accent: '#06B6D4',
    body: `
      <!-- Long Angled Toothbrush Handle -->
      <path d="M85 215 L215 152 L298 152 C308 152 308 168 298 168 L218 168 L92 230 C82 234 76 220 85 215 Z" fill="#06B6D4"/>
      <!-- White Bristles Block -->
      <rect x="232" y="120" width="62" height="32" rx="4" fill="#FFFFFF"/>
      <line x1="244" y1="122" x2="244" y2="152" stroke-width="2.5"/>
      <line x1="256" y1="122" x2="256" y2="152" stroke-width="2.5"/>
      <line x1="268" y1="122" x2="268" y2="152" stroke-width="2.5"/>
      <line x1="280" y1="122" x2="280" y2="152" stroke-width="2.5"/>
      <!-- Swirl of Mint Toothpaste on Top -->
      <path d="M234 118 C242 92 268 108 282 96 C294 86 302 106 292 118 Z" fill="#34D399"/>
    `,
  },
  swimming: {
    accent: '#0284C7',
    body: `
      <!-- Swimmer Head & Goggles -->
      <circle cx="242" cy="142" r="24" fill="#FDE68A"/>
      <rect x="242" y="134" width="22" height="10" rx="4" fill="#38BDF8"/>
      <!-- Freestyle Overhead Reaching Arm & Torso -->
      <path d="M168 168 Q205 148 232 162" fill="#F97316"/>
      <path d="M215 155 L245 102 L288 122" fill="none" stroke="#FDE68A" stroke-width="12"/>
      <path d="M215 155 L245 102 L288 122" fill="none" stroke-width="4"/>
      <!-- Wavy Blue Water Lines -->
      <path d="M72 175 Q115 158 158 175 T244 175 T330 175" fill="none" stroke="#0284C7" stroke-width="7"/>
      <path d="M85 205 Q128 188 172 205 T258 205 T325 205" fill="none" stroke="#38BDF8" stroke-width="5"/>
      <!-- Water Splash Droplets -->
      <circle cx="122" cy="145" r="5" fill="#38BDF8"/>
      <circle cx="140" cy="132" r="6" fill="#38BDF8"/>
      <circle cx="105" cy="155" r="4" fill="#38BDF8"/>
    `,
  },
  bat: {
    accent: '#475569',
    body: `
      <!-- Default Flying Mammal Bat -->
      <path d="M200 148 C155 95 95 105 85 162 Q115 145 138 168 Q162 148 185 172 L215 172 Q238 148 262 168 Q285 145 315 162 C305 105 245 95 200 148 Z" fill="#475569"/>
      <ellipse cx="200" cy="152" rx="18" ry="26" fill="#334155"/>
      <polygon points="186,130 180,106 196,124" fill="#334155"/>
      <polygon points="214,130 220,106 204,124" fill="#334155"/>
      <circle cx="193" cy="142" r="3" fill="#FEF08A"/>
      <circle cx="207" cy="142" r="3" fill="#FEF08A"/>
    `,
  },
};

/**
 * Category-disambiguated SVG recipes for homographs (words whose meaning depends on category).
 */
const CATEGORY_WORD_SVG_RECIPES: Record<string, { accent: string; body: string }> = {
  'animals::bat': WORD_SVG_RECIPES.bat,
  'sports::bat': {
    accent: '#D97706',
    body: `
      <!-- Wooden Sports Baseball/Cricket Bat & Ball -->
      <path d="M105 225 L262 68 C275 56 296 76 284 90 L122 240 Z" fill="#F59E0B"/>
      <circle cx="108" cy="232" r="10" fill="#B45309"/>
      <!-- Ball with Stitches & Impact Lines -->
      <circle cx="275" cy="158" r="22" fill="#FFFFFF"/>
      <path d="M262 144 Q275 158 262 172" fill="none" stroke="#EF4444" stroke-width="3"/>
      <path d="M288 144 Q275 158 288 172" fill="none" stroke="#EF4444" stroke-width="3"/>
      <line x1="232" y1="125" x2="248" y2="138" stroke="#FACC15" stroke-width="4"/>
      <line x1="222" y1="148" x2="242" y2="152" stroke="#FACC15" stroke-width="4"/>
    `,
  },
};

/**
 * Looks up an exact, word-matched SVG illustration for the given word and category.
 * Returns null if no exact illustration exists (never returns an unrelated placeholder!).
 */
export function findLocalSvgIllustration(
  word: string,
  category?: string
): string | null {
  const normWord = word.trim().toLowerCase().replace(/\s+/g, ' ');
  const normCat = (category || '').trim().toLowerCase().replace(/\s+/g, ' ');

  if (normCat) {
    const categorySpecific =
      CATEGORY_WORD_SVG_RECIPES[`${normCat}::${normWord}`];
    if (categorySpecific) {
      return wrapSketchSvg(categorySpecific.body, categorySpecific.accent);
    }
  }

  const matched = WORD_SVG_RECIPES[normWord];
  if (matched) {
    return wrapSketchSvg(matched.body, matched.accent);
  }

  return null;
}

export function hasExactLocalIllustration(
  word: string,
  category?: string
): boolean {
  return findLocalSvgIllustration(word, category) !== null;
}

/**
 * Generates a local SVG illustration for a known Pictionary word.
 * Returns null if the word does not have an exact local illustration.
 */
export function generateLocalSvgIllustration(
  word: string,
  category?: string
): string | null {
  return findLocalSvgIllustration(word, category);
}

