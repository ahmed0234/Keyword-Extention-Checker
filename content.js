// content.js — Hardscaping Company Finder Engine v4.0
// Detects genuine hardscape contractors using a 4-tier weighted keyword system
// with negative keyword penalties to filter out lawn-care / softscape-only companies.
//
// Tier 1 (weight=15): Core hardscape construction terms  — highest signal
// Tier 2 (weight=10): Strong hardscape service terms     — major signal
// Tier 3 (weight=5):  Supporting/related service terms   — moderate signal
// Tier 4 (weight=2):  Contextual/generic hardscape words — minor signal
// Negative (weight=−10): Lawn-care / softscape-only terms — penalty

(function () {
  "use strict";

  // ── 1. HARDSCAPE KEYWORD LEXICON ─────────────────────────────────────────
  // Each keyword entry: { category, tier, weight, label }
  // category IDs: 'patios' | 'walls' | 'outdoor_living' | 'walkways_drives' | 'water_landscape' | 'site_work'

  const HARDSCAPE_KEYWORDS = [

    // ════════════════════════════════════════════════════════════════════════
    // TIER 1 — CORE HARDSCAPE CONSTRUCTION (weight = 15)
    // These terms confirm a primary hardscape contractor. High precision.
    // ════════════════════════════════════════════════════════════════════════

    // ── Patios & Pavers ──
    { kw: 'patio installation',           category: 'patios',          tier: 1, weight: 15, label: 'Patio Installation' },
    { kw: 'patio installations',          category: 'patios',          tier: 1, weight: 15, label: 'Patio Installation' },
    { kw: 'patio installer',              category: 'patios',          tier: 1, weight: 15, label: 'Patio Installation' },
    { kw: 'paver patio',                  category: 'patios',          tier: 1, weight: 15, label: 'Paver Patio' },
    { kw: 'paver patios',                 category: 'patios',          tier: 1, weight: 15, label: 'Paver Patio' },
    { kw: 'paver installation',           category: 'patios',          tier: 1, weight: 15, label: 'Paver Installation' },
    { kw: 'paver installer',              category: 'patios',          tier: 1, weight: 15, label: 'Paver Installation' },
    { kw: 'brick paver',                  category: 'patios',          tier: 1, weight: 15, label: 'Brick Pavers' },
    { kw: 'brick pavers',                 category: 'patios',          tier: 1, weight: 15, label: 'Brick Pavers' },
    { kw: 'concrete paver',               category: 'patios',          tier: 1, weight: 15, label: 'Concrete Pavers' },
    { kw: 'concrete pavers',              category: 'patios',          tier: 1, weight: 15, label: 'Concrete Pavers' },
    { kw: 'natural stone patio',          category: 'patios',          tier: 1, weight: 15, label: 'Natural Stone Patio' },
    { kw: 'natural stone patios',         category: 'patios',          tier: 1, weight: 15, label: 'Natural Stone Patio' },
    { kw: 'flagstone patio',              category: 'patios',          tier: 1, weight: 15, label: 'Flagstone Patio' },
    { kw: 'flagstone patios',             category: 'patios',          tier: 1, weight: 15, label: 'Flagstone Patio' },
    { kw: 'travertine patio',             category: 'patios',          tier: 1, weight: 15, label: 'Travertine Patio' },
    { kw: 'travertine patios',            category: 'patios',          tier: 1, weight: 15, label: 'Travertine Patio' },
    { kw: 'patio contractor',             category: 'patios',          tier: 1, weight: 15, label: 'Patio Contractor' },
    { kw: 'patio contractors',            category: 'patios',          tier: 1, weight: 15, label: 'Patio Contractor' },
    { kw: 'patio builder',                category: 'patios',          tier: 1, weight: 15, label: 'Patio Builder' },
    { kw: 'patio builders',               category: 'patios',          tier: 1, weight: 15, label: 'Patio Builder' },
    { kw: 'paver contractor',             category: 'patios',          tier: 1, weight: 15, label: 'Paver Contractor' },
    { kw: 'paver contractors',            category: 'patios',          tier: 1, weight: 15, label: 'Paver Contractor' },
    { kw: 'paver company',                category: 'patios',          tier: 1, weight: 15, label: 'Paver Company' },

    // ── Hardscape Identity ──
    { kw: 'hardscaping contractor',       category: 'patios',          tier: 1, weight: 15, label: 'Hardscaping Contractor' },
    { kw: 'hardscaping contractors',      category: 'patios',          tier: 1, weight: 15, label: 'Hardscaping Contractor' },
    { kw: 'hardscaping company',          category: 'patios',          tier: 1, weight: 15, label: 'Hardscaping Company' },
    { kw: 'hardscape contractor',         category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Contractor' },
    { kw: 'hardscape design',             category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Design' },
    { kw: 'hardscape designer',           category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Design' },
    { kw: 'hardscape installation',       category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Installation' },
    { kw: 'hardscape construction',       category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Construction' },
    { kw: 'hardscape builder',            category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Builder' },
    { kw: 'hardscape specialist',         category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Specialist' },
    { kw: 'hardscape services',           category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Services' },
    { kw: 'hardscape renovation',         category: 'patios',          tier: 1, weight: 15, label: 'Hardscape Renovation' },

    // ── Retaining Walls ──
    { kw: 'retaining wall',               category: 'walls',           tier: 1, weight: 15, label: 'Retaining Wall' },
    { kw: 'retaining walls',              category: 'walls',           tier: 1, weight: 15, label: 'Retaining Wall' },
    { kw: 'retaining wall installation',  category: 'walls',           tier: 1, weight: 15, label: 'Retaining Wall Installation' },
    { kw: 'retaining wall contractor',    category: 'walls',           tier: 1, weight: 15, label: 'Retaining Wall Contractor' },
    { kw: 'retaining wall builder',       category: 'walls',           tier: 1, weight: 15, label: 'Retaining Wall Builder' },
    { kw: 'masonry contractor',           category: 'walls',           tier: 1, weight: 15, label: 'Masonry Contractor' },
    { kw: 'masonry contractors',          category: 'walls',           tier: 1, weight: 15, label: 'Masonry Contractor' },
    { kw: 'masonry company',              category: 'walls',           tier: 1, weight: 15, label: 'Masonry Company' },

    // ── Outdoor Kitchens ──
    { kw: 'outdoor kitchen',              category: 'outdoor_living',  tier: 1, weight: 15, label: 'Outdoor Kitchen' },
    { kw: 'outdoor kitchens',             category: 'outdoor_living',  tier: 1, weight: 15, label: 'Outdoor Kitchen' },
    { kw: 'outdoor kitchen installation', category: 'outdoor_living',  tier: 1, weight: 15, label: 'Outdoor Kitchen Installation' },
    { kw: 'outdoor kitchen contractor',   category: 'outdoor_living',  tier: 1, weight: 15, label: 'Outdoor Kitchen Contractor' },
    { kw: 'outdoor kitchen builder',      category: 'outdoor_living',  tier: 1, weight: 15, label: 'Outdoor Kitchen Builder' },
    { kw: 'outdoor kitchen design',       category: 'outdoor_living',  tier: 1, weight: 15, label: 'Outdoor Kitchen Design' },

    // ── Landscape / Outdoor Construction (identity) ──
    { kw: 'landscape construction',       category: 'site_work',       tier: 1, weight: 15, label: 'Landscape Construction' },
    { kw: 'landscape construction company', category: 'site_work',     tier: 1, weight: 15, label: 'Landscape Construction' },
    { kw: 'outdoor construction',         category: 'site_work',       tier: 1, weight: 15, label: 'Outdoor Construction' },
    { kw: 'outdoor contractor',           category: 'site_work',       tier: 1, weight: 15, label: 'Outdoor Contractor' },
    { kw: 'outdoor contractors',          category: 'site_work',       tier: 1, weight: 15, label: 'Outdoor Contractor' },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 2 — STRONG HARDSCAPE SERVICES (weight = 10)
    // Clear hardscape work but also appears in some non-specialist companies.
    // ════════════════════════════════════════════════════════════════════════

    // ── Patios (tier 2) ──
    { kw: 'patio design',                 category: 'patios',          tier: 2, weight: 10, label: 'Patio Design' },
    { kw: 'patio renovation',             category: 'patios',          tier: 2, weight: 10, label: 'Patio Renovation' },
    { kw: 'patio construction',           category: 'patios',          tier: 2, weight: 10, label: 'Patio Construction' },
    { kw: 'patio remodel',                category: 'patios',          tier: 2, weight: 10, label: 'Patio Remodel' },
    { kw: 'patio makeover',               category: 'patios',          tier: 2, weight: 10, label: 'Patio Makeover' },
    { kw: 'custom patio',                 category: 'patios',          tier: 2, weight: 10, label: 'Custom Patio' },
    { kw: 'custom patios',                category: 'patios',          tier: 2, weight: 10, label: 'Custom Patio' },
    { kw: 'outdoor patio',                category: 'patios',          tier: 2, weight: 10, label: 'Outdoor Patio' },
    { kw: 'bluestone patio',              category: 'patios',          tier: 2, weight: 10, label: 'Bluestone Patio' },
    { kw: 'slate patio',                  category: 'patios',          tier: 2, weight: 10, label: 'Slate Patio' },
    { kw: 'cobblestone patio',            category: 'patios',          tier: 2, weight: 10, label: 'Cobblestone Patio' },
    { kw: 'paver repair',                 category: 'patios',          tier: 2, weight: 10, label: 'Paver Repair' },
    { kw: 'paver sealing',                category: 'patios',          tier: 2, weight: 10, label: 'Paver Sealing' },
    { kw: 'paver restoration',            category: 'patios',          tier: 2, weight: 10, label: 'Paver Restoration' },
    { kw: 'paver resurfacing',            category: 'patios',          tier: 2, weight: 10, label: 'Paver Resurfacing' },

    // ── Walls & Masonry (tier 2) ──
    { kw: 'seat wall',                    category: 'walls',           tier: 2, weight: 10, label: 'Seat Wall' },
    { kw: 'seat walls',                   category: 'walls',           tier: 2, weight: 10, label: 'Seat Wall' },
    { kw: 'garden wall',                  category: 'walls',           tier: 2, weight: 10, label: 'Garden Wall' },
    { kw: 'garden walls',                 category: 'walls',           tier: 2, weight: 10, label: 'Garden Wall' },
    { kw: 'stone wall',                   category: 'walls',           tier: 2, weight: 10, label: 'Stone Wall' },
    { kw: 'stone walls',                  category: 'walls',           tier: 2, weight: 10, label: 'Stone Wall' },
    { kw: 'boulder wall',                 category: 'walls',           tier: 2, weight: 10, label: 'Boulder Wall' },
    { kw: 'boulder walls',                category: 'walls',           tier: 2, weight: 10, label: 'Boulder Wall' },
    { kw: 'block wall',                   category: 'walls',           tier: 2, weight: 10, label: 'Block Wall' },
    { kw: 'block walls',                  category: 'walls',           tier: 2, weight: 10, label: 'Block Wall' },
    { kw: 'brick wall',                   category: 'walls',           tier: 2, weight: 10, label: 'Brick Wall' },
    { kw: 'brick walls',                  category: 'walls',           tier: 2, weight: 10, label: 'Brick Wall' },
    { kw: 'privacy wall',                 category: 'walls',           tier: 2, weight: 10, label: 'Privacy Wall' },
    { kw: 'privacy walls',                category: 'walls',           tier: 2, weight: 10, label: 'Privacy Wall' },
    { kw: 'stone masonry',                category: 'walls',           tier: 2, weight: 10, label: 'Stone Masonry' },
    { kw: 'brick masonry',                category: 'walls',           tier: 2, weight: 10, label: 'Brick Masonry' },
    { kw: 'masonry work',                 category: 'walls',           tier: 2, weight: 10, label: 'Masonry Work' },
    { kw: 'masonry services',             category: 'walls',           tier: 2, weight: 10, label: 'Masonry Services' },
    { kw: 'masonry construction',         category: 'walls',           tier: 2, weight: 10, label: 'Masonry Construction' },
    { kw: 'stone installation',           category: 'walls',           tier: 2, weight: 10, label: 'Stone Installation' },
    { kw: 'rock installation',            category: 'walls',           tier: 2, weight: 10, label: 'Rock Installation' },
    { kw: 'boulder installation',         category: 'walls',           tier: 2, weight: 10, label: 'Boulder Installation' },
    { kw: 'concrete block',               category: 'walls',           tier: 2, weight: 10, label: 'Concrete Block' },
    { kw: 'segmental retaining',          category: 'walls',           tier: 2, weight: 10, label: 'Segmental Retaining' },
    { kw: 'allan block',                  category: 'walls',           tier: 2, weight: 10, label: 'Allan Block' },
    { kw: 'versa-lok',                    category: 'walls',           tier: 2, weight: 10, label: 'Versa-Lok' },
    { kw: 'versalok',                     category: 'walls',           tier: 2, weight: 10, label: 'Versa-Lok' },
    { kw: 'natural stone wall',           category: 'walls',           tier: 2, weight: 10, label: 'Natural Stone Wall' },
    { kw: 'dry stack wall',               category: 'walls',           tier: 2, weight: 10, label: 'Dry Stack Wall' },
    { kw: 'fieldstone wall',              category: 'walls',           tier: 2, weight: 10, label: 'Fieldstone Wall' },

    // ── Outdoor Living (tier 2) ──
    { kw: 'outdoor living space',         category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Living Space' },
    { kw: 'outdoor living spaces',        category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Living Space' },
    { kw: 'outdoor living area',          category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Living Area' },
    { kw: 'outdoor fireplace',            category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Fireplace' },
    { kw: 'outdoor fireplaces',           category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Fireplace' },
    { kw: 'fire pit installation',        category: 'outdoor_living',  tier: 2, weight: 10, label: 'Fire Pit Installation' },
    { kw: 'fire pit design',              category: 'outdoor_living',  tier: 2, weight: 10, label: 'Fire Pit Design' },
    { kw: 'fire feature',                 category: 'outdoor_living',  tier: 2, weight: 10, label: 'Fire Feature' },
    { kw: 'fire features',                category: 'outdoor_living',  tier: 2, weight: 10, label: 'Fire Feature' },
    { kw: 'outdoor entertainment',        category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Entertainment' },
    { kw: 'outdoor entertaining',         category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Entertainment' },
    { kw: 'backyard transformation',      category: 'outdoor_living',  tier: 2, weight: 10, label: 'Backyard Transformation' },
    { kw: 'backyard transformations',     category: 'outdoor_living',  tier: 2, weight: 10, label: 'Backyard Transformation' },
    { kw: 'outdoor renovation',           category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Renovation' },
    { kw: 'outdoor renovations',          category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Renovation' },
    { kw: 'luxury outdoor living',        category: 'outdoor_living',  tier: 2, weight: 10, label: 'Luxury Outdoor Living' },
    { kw: 'luxury outdoor',              category: 'outdoor_living',  tier: 2, weight: 10, label: 'Luxury Outdoor' },
    { kw: 'outdoor living design',        category: 'outdoor_living',  tier: 2, weight: 10, label: 'Outdoor Living Design' },
    { kw: 'courtyard',                    category: 'outdoor_living',  tier: 2, weight: 10, label: 'Courtyard' },
    { kw: 'courtyards',                   category: 'outdoor_living',  tier: 2, weight: 10, label: 'Courtyard' },
    { kw: 'courtyard design',             category: 'outdoor_living',  tier: 2, weight: 10, label: 'Courtyard Design' },
    { kw: 'courtyard installation',       category: 'outdoor_living',  tier: 2, weight: 10, label: 'Courtyard Installation' },

    // ── Walkways & Driveways (tier 2) ──
    { kw: 'walkway installation',         category: 'walkways_drives', tier: 2, weight: 10, label: 'Walkway Installation' },
    { kw: 'walkway installer',            category: 'walkways_drives', tier: 2, weight: 10, label: 'Walkway Installation' },
    { kw: 'paver walkway',                category: 'walkways_drives', tier: 2, weight: 10, label: 'Paver Walkway' },
    { kw: 'paver walkways',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Paver Walkway' },
    { kw: 'stone walkway',                category: 'walkways_drives', tier: 2, weight: 10, label: 'Stone Walkway' },
    { kw: 'stone walkways',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Stone Walkway' },
    { kw: 'flagstone walkway',            category: 'walkways_drives', tier: 2, weight: 10, label: 'Flagstone Walkway' },
    { kw: 'stepping stones',              category: 'walkways_drives', tier: 2, weight: 10, label: 'Stepping Stones' },
    { kw: 'pathway installation',         category: 'walkways_drives', tier: 2, weight: 10, label: 'Pathway Installation' },
    { kw: 'pathway design',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Pathway Design' },
    { kw: 'driveway installation',        category: 'walkways_drives', tier: 2, weight: 10, label: 'Driveway Installation' },
    { kw: 'paver driveway',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Paver Driveway' },
    { kw: 'paver driveways',              category: 'walkways_drives', tier: 2, weight: 10, label: 'Paver Driveway' },
    { kw: 'brick driveway',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Brick Driveway' },
    { kw: 'stone driveway',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Stone Driveway' },
    { kw: 'pool deck',                    category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Deck' },
    { kw: 'pool decks',                   category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Deck' },
    { kw: 'pool deck installation',       category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Deck Installation' },
    { kw: 'pool surround',                category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Surround' },
    { kw: 'pool surrounds',               category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Surround' },
    { kw: 'pool patio',                   category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Patio' },
    { kw: 'pool coping',                  category: 'walkways_drives', tier: 2, weight: 10, label: 'Pool Coping' },
    { kw: 'entryway',                     category: 'walkways_drives', tier: 2, weight: 10, label: 'Entryway' },
    { kw: 'entryways',                    category: 'walkways_drives', tier: 2, weight: 10, label: 'Entryway' },
    { kw: 'stone steps',                  category: 'walkways_drives', tier: 2, weight: 10, label: 'Stone Steps' },
    { kw: 'paver steps',                  category: 'walkways_drives', tier: 2, weight: 10, label: 'Paver Steps' },
    { kw: 'entry steps',                  category: 'walkways_drives', tier: 2, weight: 10, label: 'Entry Steps' },
    { kw: 'outdoor steps',                category: 'walkways_drives', tier: 2, weight: 10, label: 'Outdoor Steps' },
    { kw: 'stamped concrete',             category: 'walkways_drives', tier: 2, weight: 10, label: 'Stamped Concrete' },
    { kw: 'decorative concrete',          category: 'walkways_drives', tier: 2, weight: 10, label: 'Decorative Concrete' },
    { kw: 'concrete installation',        category: 'walkways_drives', tier: 2, weight: 10, label: 'Concrete Installation' },

    // ── Water Features & Lighting (tier 2) ──
    { kw: 'water feature installation',   category: 'water_landscape', tier: 2, weight: 10, label: 'Water Feature Installation' },
    { kw: 'water feature design',         category: 'water_landscape', tier: 2, weight: 10, label: 'Water Feature Design' },
    { kw: 'fountain installation',        category: 'water_landscape', tier: 2, weight: 10, label: 'Fountain Installation' },
    { kw: 'waterfall installation',       category: 'water_landscape', tier: 2, weight: 10, label: 'Waterfall Installation' },
    { kw: 'waterfall design',             category: 'water_landscape', tier: 2, weight: 10, label: 'Waterfall Design' },
    { kw: 'pond installation',            category: 'water_landscape', tier: 2, weight: 10, label: 'Pond Installation' },
    { kw: 'pond construction',            category: 'water_landscape', tier: 2, weight: 10, label: 'Pond Construction' },
    { kw: 'landscape lighting installation', category: 'water_landscape', tier: 2, weight: 10, label: 'Landscape Lighting Installation' },
    { kw: 'outdoor lighting installation',   category: 'water_landscape', tier: 2, weight: 10, label: 'Outdoor Lighting Installation' },
    { kw: 'outdoor lighting design',      category: 'water_landscape', tier: 2, weight: 10, label: 'Outdoor Lighting Design' },
    { kw: 'pergola installation',         category: 'outdoor_living',  tier: 2, weight: 10, label: 'Pergola Installation' },
    { kw: 'pergola builder',              category: 'outdoor_living',  tier: 2, weight: 10, label: 'Pergola Builder' },
    { kw: 'gazebo installation',          category: 'outdoor_living',  tier: 2, weight: 10, label: 'Gazebo Installation' },
    { kw: 'gazebo builder',               category: 'outdoor_living',  tier: 2, weight: 10, label: 'Gazebo Builder' },

    // ── Site Work (tier 2) ──
    { kw: 'french drain',                 category: 'site_work',       tier: 2, weight: 10, label: 'French Drain' },
    { kw: 'french drains',                category: 'site_work',       tier: 2, weight: 10, label: 'French Drain' },
    { kw: 'french drain installation',    category: 'site_work',       tier: 2, weight: 10, label: 'French Drain Installation' },
    { kw: 'drainage solution',            category: 'site_work',       tier: 2, weight: 10, label: 'Drainage Solution' },
    { kw: 'drainage solutions',           category: 'site_work',       tier: 2, weight: 10, label: 'Drainage Solution' },
    { kw: 'drainage installation',        category: 'site_work',       tier: 2, weight: 10, label: 'Drainage Installation' },
    { kw: 'grading and drainage',         category: 'site_work',       tier: 2, weight: 10, label: 'Grading and Drainage' },
    { kw: 'excavation contractor',        category: 'site_work',       tier: 2, weight: 10, label: 'Excavation Contractor' },
    { kw: 'excavation services',          category: 'site_work',       tier: 2, weight: 10, label: 'Excavation Services' },
    { kw: 'site preparation',             category: 'site_work',       tier: 2, weight: 10, label: 'Site Preparation' },
    { kw: 'site prep',                    category: 'site_work',       tier: 2, weight: 10, label: 'Site Preparation' },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 3 — SUPPORTING SERVICES (weight = 5)
    // Associated with hardscape work but also found in landscaping generally.
    // ════════════════════════════════════════════════════════════════════════

    // ── Patios (tier 3) ──
    { kw: 'patio',                        category: 'patios',          tier: 3, weight: 5, label: 'Patio' },
    { kw: 'patios',                       category: 'patios',          tier: 3, weight: 5, label: 'Patio' },
    { kw: 'outdoor paving',               category: 'patios',          tier: 3, weight: 5, label: 'Outdoor Paving' },
    { kw: 'stone paving',                 category: 'patios',          tier: 3, weight: 5, label: 'Stone Paving' },
    { kw: 'concrete patio',               category: 'patios',          tier: 3, weight: 5, label: 'Concrete Patio' },
    { kw: 'new patio',                    category: 'patios',          tier: 3, weight: 5, label: 'New Patio' },
    { kw: 'patio project',                category: 'patios',          tier: 3, weight: 5, label: 'Patio Project' },
    { kw: 'patio projects',               category: 'patios',          tier: 3, weight: 5, label: 'Patio Projects' },
    { kw: 'patio gallery',                category: 'patios',          tier: 3, weight: 5, label: 'Patio Gallery' },
    { kw: 'backyard patio',               category: 'patios',          tier: 3, weight: 5, label: 'Backyard Patio' },
    { kw: 'patio space',                  category: 'patios',          tier: 3, weight: 5, label: 'Patio Space' },
    { kw: 'patio ideas',                  category: 'patios',          tier: 3, weight: 5, label: 'Patio Ideas' },
    { kw: 'travertine',                   category: 'patios',          tier: 3, weight: 5, label: 'Travertine' },
    { kw: 'bluestone',                    category: 'patios',          tier: 3, weight: 5, label: 'Bluestone' },
    { kw: 'cobblestone',                  category: 'patios',          tier: 3, weight: 5, label: 'Cobblestone' },
    { kw: 'fieldstone',                   category: 'patios',          tier: 3, weight: 5, label: 'Fieldstone' },
    { kw: 'quartzite',                    category: 'patios',          tier: 3, weight: 5, label: 'Quartzite' },
    { kw: 'slate',                        category: 'patios',          tier: 3, weight: 5, label: 'Slate Stone' },
    { kw: 'natural stone',                category: 'patios',          tier: 3, weight: 5, label: 'Natural Stone' },
    { kw: 'flagstone',                    category: 'patios',          tier: 3, weight: 5, label: 'Flagstone' },

    // ── Walls (tier 3) ──
    { kw: 'wall installation',            category: 'walls',           tier: 3, weight: 5, label: 'Wall Installation' },
    { kw: 'wall construction',            category: 'walls',           tier: 3, weight: 5, label: 'Wall Construction' },
    { kw: 'wall builder',                 category: 'walls',           tier: 3, weight: 5, label: 'Wall Builder' },
    { kw: 'stone work',                   category: 'walls',           tier: 3, weight: 5, label: 'Stone Work' },
    { kw: 'stonework',                    category: 'walls',           tier: 3, weight: 5, label: 'Stonework' },
    { kw: 'brick work',                   category: 'walls',           tier: 3, weight: 5, label: 'Brick Work' },
    { kw: 'brickwork',                    category: 'walls',           tier: 3, weight: 5, label: 'Brickwork' },
    { kw: 'masonry',                      category: 'walls',           tier: 3, weight: 5, label: 'Masonry' },
    { kw: 'mason',                        category: 'walls',           tier: 3, weight: 5, label: 'Mason' },
    { kw: 'stone veneer',                 category: 'walls',           tier: 3, weight: 5, label: 'Stone Veneer' },
    { kw: 'landscape wall',               category: 'walls',           tier: 3, weight: 5, label: 'Landscape Wall' },
    { kw: 'landscape walls',              category: 'walls',           tier: 3, weight: 5, label: 'Landscape Wall' },
    { kw: 'erosion control',              category: 'walls',           tier: 3, weight: 5, label: 'Erosion Control' },
    { kw: 'slope stabilization',          category: 'walls',           tier: 3, weight: 5, label: 'Slope Stabilization' },

    // ── Outdoor Living (tier 3) ──
    { kw: 'outdoor living',               category: 'outdoor_living',  tier: 3, weight: 5, label: 'Outdoor Living' },
    { kw: 'fire pit',                     category: 'outdoor_living',  tier: 3, weight: 5, label: 'Fire Pit' },
    { kw: 'fire pits',                    category: 'outdoor_living',  tier: 3, weight: 5, label: 'Fire Pit' },
    { kw: 'fireplace installation',       category: 'outdoor_living',  tier: 3, weight: 5, label: 'Fireplace Installation' },
    { kw: 'pergola',                      category: 'outdoor_living',  tier: 3, weight: 5, label: 'Pergola' },
    { kw: 'pergolas',                     category: 'outdoor_living',  tier: 3, weight: 5, label: 'Pergola' },
    { kw: 'gazebo',                       category: 'outdoor_living',  tier: 3, weight: 5, label: 'Gazebo' },
    { kw: 'gazebos',                      category: 'outdoor_living',  tier: 3, weight: 5, label: 'Gazebo' },
    { kw: 'arbor',                        category: 'outdoor_living',  tier: 3, weight: 5, label: 'Arbor' },
    { kw: 'trellis',                      category: 'outdoor_living',  tier: 3, weight: 5, label: 'Trellis' },
    { kw: 'outdoor structure',            category: 'outdoor_living',  tier: 3, weight: 5, label: 'Outdoor Structure' },
    { kw: 'outdoor structures',           category: 'outdoor_living',  tier: 3, weight: 5, label: 'Outdoor Structure' },
    { kw: 'backyard design',              category: 'outdoor_living',  tier: 3, weight: 5, label: 'Backyard Design' },
    { kw: 'backyard renovation',          category: 'outdoor_living',  tier: 3, weight: 5, label: 'Backyard Renovation' },
    { kw: 'outdoor bar',                  category: 'outdoor_living',  tier: 3, weight: 5, label: 'Outdoor Bar' },
    { kw: 'pizza oven',                   category: 'outdoor_living',  tier: 3, weight: 5, label: 'Pizza Oven' },
    { kw: 'grill station',                category: 'outdoor_living',  tier: 3, weight: 5, label: 'Grill Station' },
    { kw: 'built-in grill',               category: 'outdoor_living',  tier: 3, weight: 5, label: 'Built-in Grill' },

    // ── Walkways & Driveways (tier 3) ──
    { kw: 'walkway',                      category: 'walkways_drives', tier: 3, weight: 5, label: 'Walkway' },
    { kw: 'walkways',                     category: 'walkways_drives', tier: 3, weight: 5, label: 'Walkway' },
    { kw: 'pathway',                      category: 'walkways_drives', tier: 3, weight: 5, label: 'Pathway' },
    { kw: 'pathways',                     category: 'walkways_drives', tier: 3, weight: 5, label: 'Pathway' },
    { kw: 'driveway',                     category: 'walkways_drives', tier: 3, weight: 5, label: 'Driveway' },
    { kw: 'driveways',                    category: 'walkways_drives', tier: 3, weight: 5, label: 'Driveway' },
    { kw: 'concrete driveway',            category: 'walkways_drives', tier: 3, weight: 5, label: 'Concrete Driveway' },
    { kw: 'asphalt driveway',             category: 'walkways_drives', tier: 3, weight: 5, label: 'Asphalt Driveway' },
    { kw: 'steps installation',           category: 'walkways_drives', tier: 3, weight: 5, label: 'Steps Installation' },
    { kw: 'concrete steps',               category: 'walkways_drives', tier: 3, weight: 5, label: 'Concrete Steps' },
    { kw: 'staircase',                    category: 'walkways_drives', tier: 3, weight: 5, label: 'Staircase' },
    { kw: 'outdoor stairs',               category: 'walkways_drives', tier: 3, weight: 5, label: 'Outdoor Stairs' },
    { kw: 'front walkway',                category: 'walkways_drives', tier: 3, weight: 5, label: 'Front Walkway' },
    { kw: 'front walk',                   category: 'walkways_drives', tier: 3, weight: 5, label: 'Front Walk' },
    { kw: 'exposed aggregate',            category: 'walkways_drives', tier: 3, weight: 5, label: 'Exposed Aggregate' },
    { kw: 'concrete overlay',             category: 'walkways_drives', tier: 3, weight: 5, label: 'Concrete Overlay' },

    // ── Water Features & Lighting (tier 3) ──
    { kw: 'water feature',                category: 'water_landscape', tier: 3, weight: 5, label: 'Water Feature' },
    { kw: 'water features',               category: 'water_landscape', tier: 3, weight: 5, label: 'Water Feature' },
    { kw: 'fountain',                     category: 'water_landscape', tier: 3, weight: 5, label: 'Fountain' },
    { kw: 'fountains',                    category: 'water_landscape', tier: 3, weight: 5, label: 'Fountain' },
    { kw: 'waterfall',                    category: 'water_landscape', tier: 3, weight: 5, label: 'Waterfall' },
    { kw: 'waterfalls',                   category: 'water_landscape', tier: 3, weight: 5, label: 'Waterfall' },
    { kw: 'pondless waterfall',           category: 'water_landscape', tier: 3, weight: 5, label: 'Pondless Waterfall' },
    { kw: 'pond',                         category: 'water_landscape', tier: 3, weight: 5, label: 'Pond' },
    { kw: 'koi pond',                     category: 'water_landscape', tier: 3, weight: 5, label: 'Koi Pond' },
    { kw: 'landscape lighting',           category: 'water_landscape', tier: 3, weight: 5, label: 'Landscape Lighting' },
    { kw: 'outdoor lighting',             category: 'water_landscape', tier: 3, weight: 5, label: 'Outdoor Lighting' },
    { kw: 'low voltage lighting',         category: 'water_landscape', tier: 3, weight: 5, label: 'Low Voltage Lighting' },
    { kw: 'led landscape lighting',       category: 'water_landscape', tier: 3, weight: 5, label: 'LED Landscape Lighting' },
    { kw: 'pathway lighting',             category: 'water_landscape', tier: 3, weight: 5, label: 'Pathway Lighting' },
    { kw: 'uplighting',                   category: 'water_landscape', tier: 3, weight: 5, label: 'Uplighting' },
    { kw: 'downlighting',                 category: 'water_landscape', tier: 3, weight: 5, label: 'Downlighting' },

    // ── Site Work (tier 3) ──
    { kw: 'drainage',                     category: 'site_work',       tier: 3, weight: 5, label: 'Drainage' },
    { kw: 'grading',                      category: 'site_work',       tier: 3, weight: 5, label: 'Grading' },
    { kw: 'excavation',                   category: 'site_work',       tier: 3, weight: 5, label: 'Excavation' },
    { kw: 'land grading',                 category: 'site_work',       tier: 3, weight: 5, label: 'Land Grading' },
    { kw: 'yard grading',                 category: 'site_work',       tier: 3, weight: 5, label: 'Yard Grading' },
    { kw: 'trench drain',                 category: 'site_work',       tier: 3, weight: 5, label: 'Trench Drain' },
    { kw: 'channel drain',                category: 'site_work',       tier: 3, weight: 5, label: 'Channel Drain' },
    { kw: 'surface drain',                category: 'site_work',       tier: 3, weight: 5, label: 'Surface Drain' },
    { kw: 'catch basin',                  category: 'site_work',       tier: 3, weight: 5, label: 'Catch Basin' },
    { kw: 'dry creek bed',                category: 'site_work',       tier: 3, weight: 5, label: 'Dry Creek Bed' },
    { kw: 'dry creek',                    category: 'site_work',       tier: 3, weight: 5, label: 'Dry Creek' },
    { kw: 'swale',                        category: 'site_work',       tier: 3, weight: 5, label: 'Swale' },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 4 — CONTEXTUAL SIGNALS (weight = 2)
    // Generic terms associated with hardscape context; low value alone.
    // ════════════════════════════════════════════════════════════════════════

    { kw: 'hardscape',                    category: 'patios',          tier: 4, weight: 2, label: 'Hardscape' },
    { kw: 'hardscaping',                  category: 'patios',          tier: 4, weight: 2, label: 'Hardscaping' },
    { kw: 'pavers',                       category: 'patios',          tier: 4, weight: 2, label: 'Pavers' },
    { kw: 'paver',                        category: 'patios',          tier: 4, weight: 2, label: 'Paver' },
    { kw: 'landscape contractor',         category: 'site_work',       tier: 4, weight: 2, label: 'Landscape Contractor' },
    { kw: 'landscape company',            category: 'site_work',       tier: 4, weight: 2, label: 'Landscape Company' },
    { kw: 'landscaping contractor',       category: 'site_work',       tier: 4, weight: 2, label: 'Landscaping Contractor' },
    { kw: 'landscaping company',          category: 'site_work',       tier: 4, weight: 2, label: 'Landscaping Company' },
    { kw: 'outdoor design',               category: 'outdoor_living',  tier: 4, weight: 2, label: 'Outdoor Design' },
    { kw: 'concrete work',                category: 'walkways_drives', tier: 4, weight: 2, label: 'Concrete Work' },
    { kw: 'concrete contractor',          category: 'walkways_drives', tier: 4, weight: 2, label: 'Concrete Contractor' },
    { kw: 'concrete company',             category: 'walkways_drives', tier: 4, weight: 2, label: 'Concrete Company' },
    { kw: 'curb appeal',                  category: 'patios',          tier: 4, weight: 2, label: 'Curb Appeal' },
    { kw: 'landscaping services',         category: 'site_work',       tier: 4, weight: 2, label: 'Landscaping Services' },
    { kw: 'landscape design',             category: 'site_work',       tier: 4, weight: 2, label: 'Landscape Design' },
    { kw: 'outdoor spaces',               category: 'outdoor_living',  tier: 4, weight: 2, label: 'Outdoor Spaces' },
    { kw: 'outdoor space',                category: 'outdoor_living',  tier: 4, weight: 2, label: 'Outdoor Space' },
    { kw: 'free estimate',                category: 'site_work',       tier: 4, weight: 2, label: 'Free Estimate' },
    { kw: 'free consultation',            category: 'site_work',       tier: 4, weight: 2, label: 'Free Consultation' },
    { kw: 'licensed and insured',         category: 'site_work',       tier: 4, weight: 2, label: 'Licensed & Insured' },
    { kw: 'family owned',                 category: 'site_work',       tier: 4, weight: 2, label: 'Family Owned' },
  ];

  // ── 2. NEGATIVE KEYWORDS (PENALTY = −10 pts each) ───────────────────────
  // These terms strongly suggest a lawn-care / softscape-only company.
  // They will REDUCE the total hardscape confidence score.
  const NEGATIVE_KEYWORDS = [
    // Lawn care / mowing
    'lawn mowing', 'grass cutting', 'lawn cutting', 'grass mowing', 'mow the lawn',
    'mowing service', 'mowing services', 'lawn mowing service', 'regular mowing',
    'weekly mowing', 'bi-weekly mowing', 'lawn care service', 'lawn care services',
    'lawn service', 'lawn services', 'lawn maintenance',
    // Fertilization / weed
    'fertilization', 'fertilization service', 'lawn fertilization', 'lawn fertilizer',
    'weed control', 'weed management', 'weed killing', 'broadleaf control',
    'crabgrass control', 'pre-emergent', 'herbicide application',
    // Irrigation sprinkler
    'sprinkler repair', 'sprinkler installation', 'sprinkler system', 'sprinkler systems',
    'irrigation repair', 'irrigation installation', 'irrigation service', 'irrigation services',
    'irrigation contractor', 'irrigation company', 'drip irrigation', 'irrigation only',
    // Arborist / tree
    'arborist', 'certified arborist', 'tree trimming', 'tree pruning', 'tree removal',
    'tree service', 'tree services', 'tree care', 'stump removal', 'stump grinding',
    'tree surgery', 'tree surgeon',
    // Softscape garden maintenance
    'garden maintenance', 'garden care', 'garden weeding', 'planting service',
    'flower bed maintenance', 'mulching service', 'mulch installation',
    // Snow removal
    'snow removal', 'snow plowing', 'snow plow', 'snow plowing service',
    'ice removal', 'de-icing service',
    // Lawn treatments
    'aeration service', 'aeration and overseeding', 'overseeding', 'lawn aeration',
    'pest control', 'lawn pest control', 'mosquito control',
    // Gutter / other unrelated
    'gutter cleaning', 'gutter cleaning service', 'power washing only',
  ];

  // ── 3. BUILD KEYWORD MAP ─────────────────────────────────────────────────
  // keyword (lowercase) → { category, tier, weight, label }
  const KEYWORD_MAP = new Map();
  // Sort longest-first to ensure greedy matching of multi-word phrases
  const sortedKeywords = [...HARDSCAPE_KEYWORDS].sort((a, b) => b.kw.length - a.kw.length);
  for (const entry of sortedKeywords) {
    KEYWORD_MAP.set(entry.kw.toLowerCase(), {
      category: entry.category,
      tier:     entry.tier,
      weight:   entry.weight,
      label:    entry.label,
    });
  }

  // Negative keyword set (lowercase) → penalty weight
  const NEGATIVE_MAP = new Map();
  const sortedNegatives = [...NEGATIVE_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedNegatives) {
    NEGATIVE_MAP.set(kw.toLowerCase(), -10);
  }

  // ── 4. SECONDARY SERVICE KEYWORDS ────────────────────────────────────────
  // These are detected and reported but do NOT affect the hardscape confidence score.
  // They appear in the "Secondary Services" section of the output.
  const SECONDARY_KEYWORDS = [
    { kw: 'landscaping',   label: 'General Landscaping' },
    { kw: 'lawn care',     label: 'Lawn Care' },
    { kw: 'fencing',       label: 'Fencing' },
    { kw: 'fence installation', label: 'Fence Installation' },
    { kw: 'irrigation',    label: 'Irrigation' },
    { kw: 'sprinkler',     label: 'Sprinkler System' },
    { kw: 'sod installation', label: 'Sod Installation' },
    { kw: 'mulching',      label: 'Mulching' },
    { kw: 'tree service',  label: 'Tree Service' },
    { kw: 'snow removal',  label: 'Snow Removal' },
    { kw: 'painting',      label: 'Painting' },
    { kw: 'power washing', label: 'Power Washing' },
    { kw: 'pressure washing', label: 'Pressure Washing' },
    { kw: 'deck building', label: 'Deck Building' },
    { kw: 'deck installation', label: 'Deck Installation' },
    { kw: 'deck contractor', label: 'Deck Contractor' },
    { kw: 'wooden deck',   label: 'Wooden Deck' },
  ];

  const SECONDARY_MAP = new Map();
  const sortedSecondary = [...SECONDARY_KEYWORDS].sort((a, b) => b.kw.length - a.kw.length);
  for (const entry of sortedSecondary) {
    SECONDARY_MAP.set(entry.kw.toLowerCase(), entry.label);
  }

  // ── 5. ELEMENT CONTEXT WEIGHTS ───────────────────────────────────────────
  // Returns { value, zone } — zone multiplier applied ON TOP of keyword weight.
  function getElementContext(el) {
    if (!el || el.nodeType !== 1) return { value: 1, zone: 'body' };

    const tag = el.tagName.toLowerCase();
    const cls = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
    const id  = (el.id || '').toLowerCase();

    // Ancestor zone detection
    const inHero    = !!el.closest('header, [class*="hero"], [class*="banner"], [class*="masthead"], [id*="hero"], [id*="banner"]');
    const inNav     = !!el.closest('nav, [class*="nav"], [class*="menu"], [role="navigation"]');
    const inFooter  = !!el.closest('footer, [class*="footer"], [id*="footer"]');
    const inService = !!el.closest('[class*="service"], [class*="offer"], [class*="what-we-do"], [class*="services"]');
    const inCTA     = !!el.closest('[class*="cta"], [class*="call-to-action"]');

    if (inHero && (tag === 'h1' || tag === 'h2')) return { value: 10, zone: 'hero-heading' };
    if (inHero)    return { value: 7, zone: 'hero' };
    if (tag === 'h1') return { value: 9, zone: 'h1' };
    if (inNav)     return { value: 8, zone: 'nav' };
    if (tag === 'h2') return { value: 7, zone: 'h2' };
    if (tag === 'h3') return { value: 6, zone: 'h3' };
    if (tag === 'h4') return { value: 5, zone: 'h4' };
    if (tag === 'h5' || tag === 'h6') return { value: 4, zone: 'heading-minor' };
    if (inService) return { value: 6, zone: 'service-section' };
    if (inCTA)     return { value: 5, zone: 'cta' };
    if ((tag === 'button' || tag === 'a') && el.innerText && el.innerText.trim().length < 60)
      return { value: 5, zone: 'button/link' };
    if (tag === 'p')    return { value: 3, zone: 'paragraph' };
    if (tag === 'li')   return { value: 3, zone: 'list-item' };
    if (tag === 'span' || tag === 'div') return { value: 2, zone: 'inline' };
    if (inFooter)  return { value: 1, zone: 'footer' };
    return { value: 2, zone: 'body' };
  }

  // ── 6. VISIBILITY CHECK ──────────────────────────────────────────────────
  function isElementVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    try {
      const style = window.getComputedStyle(el);
      if (style.display    === 'none')   return false;
      if (style.visibility === 'hidden') return false;
      if (style.opacity    === '0')      return false;
      return true;
    } catch (e) {
      return true;
    }
  }

  // ── 7. TEXT EXTRACTION STRATEGIES ───────────────────────────────────────

  // Strategy A: TreeWalker over all visible text nodes
  function extractFromTreeWalker() {
    const results = [];
    const walker  = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'HEAD', 'TEMPLATE'].includes(tag))
            return NodeFilter.FILTER_REJECT;
          if (!isElementVisible(parent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    let node;
    let count = 0;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (text.length >= 2) {
        results.push({ text, element: node.parentElement });
        count++;
      }
    }
    return { items: results, count };
  }

  // Strategy B: Direct scan of high-value selectors
  function extractFromHighValueSelectors() {
    const results = [];
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'nav a, nav li, [class*="nav"] a, [class*="menu"] a, [role="navigation"] a',
      '[class*="hero"] *, [class*="banner"] *, [class*="masthead"] *',
      '[id*="hero"] *, [id*="banner"] *',
      '[class*="service"] *, [class*="offer"] *',
      'button, [class*="cta"] *, [class*="call-to-action"] *',
      '[class*="card"] *, [class*="feature"] *',
      'main li, article li, section li',
    ];

    const seenElements = new Set();
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (seenElements.has(el)) continue;
          seenElements.add(el);
          const text = (el.innerText || el.textContent || '').trim();
          if (text.length >= 2 && text.length <= 500) {
            results.push({ text, element: el });
          }
          const ariaLabel = el.getAttribute('aria-label');
          if (ariaLabel && ariaLabel.trim().length >= 2)
            results.push({ text: ariaLabel.trim(), element: el });
          const titleAttr = el.getAttribute('title');
          if (titleAttr && titleAttr.trim().length >= 2)
            results.push({ text: titleAttr.trim(), element: el });
          if (el.tagName === 'IMG') {
            const alt = el.getAttribute('alt');
            if (alt && alt.trim().length >= 2)
              results.push({ text: alt.trim(), element: el });
          }
        }
      } catch (e) {
        // Invalid selector — skip
      }
    }
    return results;
  }

  // Strategy C: Meta tags, page title, structured data
  function extractFromMeta() {
    const results  = [];
    const title    = document.title || '';
    const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
    const metaKw   = document.querySelector('meta[name="keywords"]')?.content   || '';
    const ogTitle  = document.querySelector('meta[property="og:title"]')?.content || '';
    const ogDesc   = document.querySelector('meta[property="og:description"]')?.content || '';

    let jsonLdText = '';
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try {
        const data = JSON.parse(s.textContent);
        jsonLdText += ' ' + JSON.stringify(data);
      } catch (e) {}
    });

    // Also scan URL path and hostname for hints
    const urlText = window.location.pathname + ' ' + window.location.hostname;

    const metaCombined = [title, metaDesc, metaKw, ogTitle, ogDesc, urlText]
      .filter(Boolean).join(' ');

    if (metaCombined.trim()) {
      results.push({ text: metaCombined, element: null, zone: 'meta', weight: 8 });
    }
    if (jsonLdText.trim()) {
      results.push({ text: jsonLdText, element: null, zone: 'structured-data', weight: 7 });
    }
    return results;
  }

  // ── 8. KEYWORD MATCHING ──────────────────────────────────────────────────

  // Find all hardscape keyword matches in a text string
  function findHardscapeMatches(text) {
    const lower   = text.toLowerCase();
    const matches = [];
    const alreadyMatched = new Set();

    for (const [kw, info] of KEYWORD_MAP) {
      if (lower.includes(kw)) {
        const key = info.category + '|' + kw;
        if (!alreadyMatched.has(key)) {
          alreadyMatched.add(key);
          const idx     = lower.indexOf(kw);
          const start   = Math.max(0, idx - 40);
          const end     = Math.min(text.length, idx + kw.length + 40);
          const snippet = text.substring(start, end).trim();
          matches.push({ kw, ...info, snippet });
        }
      }
    }
    return matches;
  }

  // Find negative keyword hits
  function findNegativeMatches(text) {
    const lower   = text.toLowerCase();
    const hits    = [];
    const alreadyMatched = new Set();

    for (const [kw] of NEGATIVE_MAP) {
      if (!alreadyMatched.has(kw) && lower.includes(kw)) {
        alreadyMatched.add(kw);
        hits.push(kw);
      }
    }
    return hits;
  }

  // Find secondary service mentions
  function findSecondaryMatches(text) {
    const lower  = text.toLowerCase();
    const hits   = [];
    const seen   = new Set();

    for (const [kw, label] of SECONDARY_MAP) {
      if (!seen.has(label) && lower.includes(kw)) {
        seen.add(label);
        hits.push(label);
      }
    }
    return hits;
  }

  // ── 9. XPATH HELPER ──────────────────────────────────────────────────────
  function getXPath(el) {
    if (!el || el === document.body) return '/html/body';
    if (el.id) return `//*[@id="${el.id}"]`;
    const tag  = el.tagName.toLowerCase();
    let index  = 1;
    let sib    = el.previousElementSibling;
    while (sib) {
      if (sib.tagName === el.tagName) index++;
      sib = sib.previousElementSibling;
    }
    return getXPath(el.parentElement) + `/${tag}[${index}]`;
  }

  // ── 10. MAIN ANALYSIS ENGINE ─────────────────────────────────────────────
  window.__remodelAnalyzer = function (opts = {}) {
    const startTime = performance.now();

    console.log('🧱 [Hardscape Finder v4.0] Starting scan...');

    const findings        = [];   // positive hardscape matches
    const debugLog        = [];
    const pageUrl         = window.location.href;
    const pageTitle       = document.title || '';
    const negativeHits    = [];   // penalty keyword hits
    const secondaryFound  = new Set(); // secondary service labels

    // ── Collect text from all strategies ──
    const { items: walkerItems, count: walkerCount } = extractFromTreeWalker();
    const selectorItems = extractFromHighValueSelectors();
    const metaItems     = extractFromMeta();

    debugLog.push(`TreeWalker text nodes: ${walkerCount}`);
    debugLog.push(`High-value selector elements: ${selectorItems.length}`);
    debugLog.push(`Meta/structured items: ${metaItems.length}`);

    const allItems = [
      ...metaItems.map((i)    => ({ ...i, source: 'meta' })),
      ...walkerItems.map((i)  => ({ ...i, source: 'walker' })),
      ...selectorItems.map((i) => ({ ...i, source: 'selector' })),
    ];

    let totalTextLength  = 0;
    let totalKeywordHits = 0;

    // ── Process each text item ──
    for (const item of allItems) {
      const text = item.text;
      if (!text || text.length < 2) continue;
      totalTextLength += text.length;

      // Positive hardscape matches
      const matches = findHardscapeMatches(text);
      totalKeywordHits += matches.length;

      for (const match of matches) {
        let weight, zone;

        if (item.weight) {
          // Meta item — use provided weight
          weight = item.weight;
          zone   = item.zone || 'meta';
        } else if (item.element) {
          const ctx = getElementContext(item.element);
          // keyword weight × zone multiplier
          weight = match.weight * ctx.value;
          zone   = ctx.zone;
        } else {
          weight = match.weight;
          zone   = 'unknown';
        }

        const xpath = item.element ? getXPath(item.element) : '/html/head';
        const tag   = item.element ? item.element.tagName.toLowerCase() : 'meta';

        findings.push({
          category:    match.category,
          matchedTerm: match.kw,
          tier:        match.tier,
          weight,
          kwBaseWeight: match.weight,
          label:       match.label,
          snippet:     match.snippet,
          zone,
          url:         pageUrl,
          xpath,
          tag,
          element:     item.element,
        });
      }

      // Negative keyword scan
      const negMatches = findNegativeMatches(text);
      for (const neg of negMatches) {
        if (!negativeHits.includes(neg)) negativeHits.push(neg);
      }

      // Secondary service scan
      const secMatches = findSecondaryMatches(text);
      for (const sec of secMatches) secondaryFound.add(sec);
    }

    const elapsed = (performance.now() - startTime).toFixed(1);
    debugLog.push(`Total text extracted: ${totalTextLength} chars`);
    debugLog.push(`Positive keyword hits: ${totalKeywordHits}`);
    debugLog.push(`Negative keyword hits: ${negativeHits.length}`);
    debugLog.push(`Secondary service signals: ${secondaryFound.size}`);
    debugLog.push(`Total findings: ${findings.length}`);
    debugLog.push(`Scan time: ${elapsed}ms`);

    console.log(`✅ [Hardscape Finder] ${findings.length} matches, ${negativeHits.length} penalties in ${elapsed}ms`);

    // Fallback: if nothing found, scan full body text
    if (findings.length === 0) {
      console.warn('⚠️ No hardscape keywords found in structured scan. Trying full body fallback...');
      const bodyText = document.body.innerText || '';
      const fallbackMatches = findHardscapeMatches(bodyText);
      for (const match of fallbackMatches) {
        findings.push({
          category:     match.category,
          matchedTerm:  match.kw,
          tier:         match.tier,
          weight:       match.weight,
          kwBaseWeight: match.weight,
          label:        match.label,
          snippet:      match.snippet,
          zone:         'fallback-body',
          url:          pageUrl,
          xpath:        '/html/body',
          tag:          'body',
          element:      null,
        });
      }
      // Fallback negatives
      const bodyNegatives = findNegativeMatches(bodyText);
      for (const neg of bodyNegatives) {
        if (!negativeHits.includes(neg)) negativeHits.push(neg);
      }
    }

    return {
      findings,
      negativeHits,
      secondaryServices: [...secondaryFound],
      pageUrl,
      pageTitle,
      totalNodes:  walkerCount,
      totalText:   totalTextLength,
      totalHits:   totalKeywordHits,
      debugLog,
      scanTime:    elapsed,
    };
  };

  // ── 11. HIGHLIGHT STYLES (6 hardscape categories) ────────────────────────
  const HIGHLIGHT_STYLES = {
    patios:          { bg: 'rgba(245,158,11,0.40)',  border: '#d97706', text: '#78350f' },
    walls:           { bg: 'rgba(148,163,184,0.40)', border: '#64748b', text: '#1e293b' },
    outdoor_living:  { bg: 'rgba(249,115,22,0.40)',  border: '#ea580c', text: '#7c2d12' },
    walkways_drives: { bg: 'rgba(96,165,250,0.40)',  border: '#2563eb', text: '#1e3a8a' },
    water_landscape: { bg: 'rgba(52,211,153,0.40)',  border: '#059669', text: '#064e3b' },
    site_work:       { bg: 'rgba(167,139,250,0.40)', border: '#7c3aed', text: '#3b0764' },
  };

  const HIGHLIGHT_STYLE_ID  = '__hardscape_hl_styles__';
  const HIGHLIGHT_MARK_ATTR = 'data-hardscape-hl';

  function injectHighlightStyles() {
    if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id    = HIGHLIGHT_STYLE_ID;
    style.textContent =
      Object.entries(HIGHLIGHT_STYLES).map(([cat, s]) => `
        mark[${HIGHLIGHT_MARK_ATTR}="${cat}"] {
          background: ${s.bg} !important;
          color: ${s.text} !important;
          outline: 1.5px solid ${s.border} !important;
          border-radius: 3px !important;
          padding: 0 2px !important;
          box-shadow: 0 1px 4px ${s.border}55 !important;
          text-decoration: none !important;
          animation: __hardscape_hl_pop__ 0.35s ease-out !important;
        }
      `).join('\n') +
      `
      @keyframes __hardscape_hl_pop__ {
        from { opacity: 0; transform: scaleX(0.92); }
        to   { opacity: 1; transform: scaleX(1); }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function clearHighlights() {
    const marks = document.querySelectorAll(`mark[${HIGHLIGHT_MARK_ATTR}]`);
    for (const mark of marks) {
      const parent = mark.parentNode;
      if (!parent) continue;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
    }
    document.body && document.body.normalize();
    const styleEl = document.getElementById(HIGHLIGHT_STYLE_ID);
    if (styleEl) styleEl.remove();
  }

  function highlightTermsOnPage(terms) {
    if (!terms || terms.length === 0) return 0;
    injectHighlightStyles();

    const sorted  = [...terms].sort((a, b) => b.term.length - a.term.length);
    const escaped = sorted.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex   = new RegExp(`(${escaped.join('|')})`, 'gi');

    const termCatMap = new Map();
    for (const { term, categoryId } of sorted) {
      termCatMap.set(term.toLowerCase(), categoryId);
    }

    let count  = 0;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'HEAD', 'TEMPLATE', 'TEXTAREA', 'INPUT'].includes(tag))
            return NodeFilter.FILTER_REJECT;
          if (tag === 'MARK' && parent.hasAttribute(HIGHLIGHT_MARK_ATTR))
            return NodeFilter.FILTER_REJECT;
          if (!isElementVisible(parent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (regex.test(node.textContent)) textNodes.push(node);
      regex.lastIndex = 0;
    }

    for (const textNode of textNodes) {
      const raw = textNode.textContent;
      regex.lastIndex = 0;

      const parts = [];
      let last    = 0;
      let m;
      while ((m = regex.exec(raw)) !== null) {
        if (m.index > last) parts.push({ text: raw.slice(last, m.index), match: false });
        parts.push({
          text:  m[0],
          match: true,
          catId: termCatMap.get(m[0].toLowerCase()) || 'patios',
        });
        last = m.index + m[0].length;
        count++;
      }
      if (last < raw.length) parts.push({ text: raw.slice(last), match: false });
      if (parts.length <= 1 && !parts[0]?.match) continue;

      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (!part.match) {
          frag.appendChild(document.createTextNode(part.text));
        } else {
          const mark = document.createElement('mark');
          mark.setAttribute(HIGHLIGHT_MARK_ATTR, part.catId);
          mark.textContent = part.text;
          frag.appendChild(mark);
        }
      }

      try {
        textNode.parentNode.replaceChild(frag, textNode);
      } catch (e) {
        // Non-replaceable node — skip
      }
    }

    return count;
  }

  // ── 12. MESSAGE LISTENER ─────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanCurrentPage') {
      try {
        const data = window.__remodelAnalyzer({ debug: true });
        sendResponse(data);
      } catch (e) {
        console.error('[Hardscape Finder] Fatal error:', e);
        sendResponse({ error: e.message, findings: [], totalNodes: 0 });
      }
      return true;
    }

    if (request.action === 'highlightKeywords') {
      try {
        clearHighlights();
        const count = highlightTermsOnPage(request.terms || []);
        sendResponse({ success: true, highlightCount: count });
      } catch (e) {
        console.error('[Hardscape Finder] Highlight error:', e);
        sendResponse({ success: false, error: e.message });
      }
      return true;
    }

    if (request.action === 'clearHighlights') {
      try {
        clearHighlights();
        sendResponse({ success: true });
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
      return true;
    }

    if (request.action === 'scrollTo') {
      const { xpath } = request;
      try {
        const result = document.evaluate(
          xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null,
        );
        const el = result.singleNodeValue;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const prev = {
            bg:         el.style.backgroundColor,
            outline:    el.style.outline,
            transition: el.style.transition,
          };
          el.style.transition       = 'background-color 0.2s, outline 0.2s';
          el.style.backgroundColor  = '#fde047';
          el.style.outline          = '3px solid #f59e0b';
          setTimeout(() => {
            el.style.backgroundColor = prev.bg         || '';
            el.style.outline         = prev.outline     || '';
            el.style.transition      = prev.transition  || '';
          }, 2500);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Element not found via XPath' });
        }
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
      return true;
    }

    return true;
  });

  console.log('🧱 Hardscaping Company Finder Engine v4.0 loaded.');
})();
