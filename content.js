// content.js — HVAC & Hardscaping Company Finder Engine v5.0
// Dual-mode detection: HVAC mode and Hardscaping mode are fully independent.
//
// ── HARDSCAPING MODE ──────────────────────────────────────────────────────────
// Tier 1 (weight=15): Core hardscape construction terms  — highest signal
// Tier 2 (weight=10): Strong hardscape service terms     — major signal
// Tier 3 (weight=5):  Supporting/related service terms   — moderate signal
// Tier 4 (weight=2):  Contextual/generic hardscape words — minor signal
// Negative (weight=−10): Lawn-care / softscape-only terms — penalty
//
// ── HVAC MODE ─────────────────────────────────────────────────────────────────
// Same tier/weight structure applied to HVAC-specific keywords.
// Tier 1 (weight=15): HVAC contractor identity terms     — highest signal
// Tier 2 (weight=10): Core HVAC service terms            — major signal
// Tier 3 (weight=5):  Supporting HVAC terminology        — moderate signal
// Tier 4 (weight=2):  Contextual HVAC words              — minor signal
// Negative (weight=−10): Manufacturer/distributor signals — penalty

(function () {
  "use strict";

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION A: HARDSCAPING KEYWORD LEXICON (unchanged from v4.0)
  // ══════════════════════════════════════════════════════════════════════════

  const HARDSCAPE_KEYWORDS = [
    // ════════════════════════════════════════════════════════════════════════
    // TIER 1 — CORE HARDSCAPE CONSTRUCTION (weight = 15)
    // ════════════════════════════════════════════════════════════════════════

    // ── Patios & Pavers ──
    {
      kw: "patio installation",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Installation",
    },
    {
      kw: "patio installations",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Installation",
    },
    {
      kw: "patio installer",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Installation",
    },
    {
      kw: "paver patio",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Patio",
    },
    {
      kw: "paver patios",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Patio",
    },
    {
      kw: "paver installation",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Installation",
    },
    {
      kw: "paver installer",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Installation",
    },
    {
      kw: "brick paver",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Brick Pavers",
    },
    {
      kw: "brick pavers",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Brick Pavers",
    },
    {
      kw: "concrete paver",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Concrete Pavers",
    },
    {
      kw: "concrete pavers",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Concrete Pavers",
    },
    {
      kw: "natural stone patio",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Natural Stone Patio",
    },
    {
      kw: "natural stone patios",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Natural Stone Patio",
    },
    {
      kw: "flagstone patio",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Flagstone Patio",
    },
    {
      kw: "flagstone patios",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Flagstone Patio",
    },
    {
      kw: "travertine patio",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Travertine Patio",
    },
    {
      kw: "travertine patios",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Travertine Patio",
    },
    {
      kw: "patio contractor",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Contractor",
    },
    {
      kw: "patio contractors",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Contractor",
    },
    {
      kw: "patio builder",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Builder",
    },
    {
      kw: "patio builders",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Patio Builder",
    },
    {
      kw: "paver contractor",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Contractor",
    },
    {
      kw: "paver contractors",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Contractor",
    },
    {
      kw: "paver company",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Paver Company",
    },

    // ── Hardscape Identity ──
    {
      kw: "hardscaping contractor",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscaping Contractor",
    },
    {
      kw: "hardscaping contractors",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscaping Contractor",
    },
    {
      kw: "hardscaping company",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscaping Company",
    },
    {
      kw: "hardscape contractor",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Contractor",
    },
    {
      kw: "hardscape design",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Design",
    },
    {
      kw: "hardscape designer",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Design",
    },
    {
      kw: "hardscape installation",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Installation",
    },
    {
      kw: "hardscape construction",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Construction",
    },
    {
      kw: "hardscape builder",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Builder",
    },
    {
      kw: "hardscape specialist",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Specialist",
    },
    {
      kw: "hardscape services",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Services",
    },
    {
      kw: "hardscape renovation",
      category: "patios",
      tier: 1,
      weight: 15,
      label: "Hardscape Renovation",
    },

    // ── Retaining Walls ──
    {
      kw: "retaining wall",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Retaining Wall",
    },
    {
      kw: "retaining walls",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Retaining Wall",
    },
    {
      kw: "retaining wall installation",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Retaining Wall Installation",
    },
    {
      kw: "retaining wall contractor",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Retaining Wall Contractor",
    },
    {
      kw: "retaining wall builder",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Retaining Wall Builder",
    },
    {
      kw: "masonry contractor",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Masonry Contractor",
    },
    {
      kw: "masonry contractors",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Masonry Contractor",
    },
    {
      kw: "masonry company",
      category: "walls",
      tier: 1,
      weight: 15,
      label: "Masonry Company",
    },

    // ── Outdoor Kitchens ──
    {
      kw: "outdoor kitchen",
      category: "outdoor_living",
      tier: 1,
      weight: 15,
      label: "Outdoor Kitchen",
    },
    {
      kw: "outdoor kitchens",
      category: "outdoor_living",
      tier: 1,
      weight: 15,
      label: "Outdoor Kitchen",
    },
    {
      kw: "outdoor kitchen installation",
      category: "outdoor_living",
      tier: 1,
      weight: 15,
      label: "Outdoor Kitchen Installation",
    },
    {
      kw: "outdoor kitchen contractor",
      category: "outdoor_living",
      tier: 1,
      weight: 15,
      label: "Outdoor Kitchen Contractor",
    },
    {
      kw: "outdoor kitchen builder",
      category: "outdoor_living",
      tier: 1,
      weight: 15,
      label: "Outdoor Kitchen Builder",
    },
    {
      kw: "outdoor kitchen design",
      category: "outdoor_living",
      tier: 1,
      weight: 15,
      label: "Outdoor Kitchen Design",
    },

    // ── Landscape / Outdoor Construction (identity) ──
    {
      kw: "landscape construction",
      category: "site_work",
      tier: 1,
      weight: 15,
      label: "Landscape Construction",
    },
    {
      kw: "landscape construction company",
      category: "site_work",
      tier: 1,
      weight: 15,
      label: "Landscape Construction",
    },
    // NOTE: "outdoor construction" / "outdoor contractor" demoted to tier 2 (weight=5).
    // These phrases are too generic at tier 1 — many non-hardscape businesses use them.
    {
      kw: "outdoor construction",
      category: "site_work",
      tier: 2,
      weight: 5,
      label: "Outdoor Construction",
    },
    {
      kw: "outdoor contractor",
      category: "site_work",
      tier: 2,
      weight: 5,
      label: "Outdoor Contractor",
    },
    {
      kw: "outdoor contractors",
      category: "site_work",
      tier: 2,
      weight: 5,
      label: "Outdoor Contractor",
    },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 2 — STRONG HARDSCAPE SERVICES (weight = 10)
    // ════════════════════════════════════════════════════════════════════════

    // ── Patios (tier 2) ──
    {
      kw: "patio design",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Patio Design",
    },
    {
      kw: "patio renovation",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Patio Renovation",
    },
    {
      kw: "patio construction",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Patio Construction",
    },
    {
      kw: "patio remodel",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Patio Remodel",
    },
    {
      kw: "patio makeover",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Patio Makeover",
    },
    {
      kw: "custom patio",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Custom Patio",
    },
    {
      kw: "custom patios",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Custom Patio",
    },
    {
      kw: "outdoor patio",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Outdoor Patio",
    },
    {
      kw: "bluestone patio",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Bluestone Patio",
    },
    {
      kw: "slate patio",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Slate Patio",
    },
    {
      kw: "cobblestone patio",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Cobblestone Patio",
    },
    {
      kw: "paver repair",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Paver Repair",
    },
    {
      kw: "paver sealing",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Paver Sealing",
    },
    {
      kw: "paver restoration",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Paver Restoration",
    },
    {
      kw: "paver resurfacing",
      category: "patios",
      tier: 2,
      weight: 10,
      label: "Paver Resurfacing",
    },

    // ── Walls & Masonry (tier 2) ──
    {
      kw: "seat wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Seat Wall",
    },
    {
      kw: "seat walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Seat Wall",
    },
    {
      kw: "garden wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Garden Wall",
    },
    {
      kw: "garden walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Garden Wall",
    },
    {
      kw: "stone wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Stone Wall",
    },
    {
      kw: "stone walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Stone Wall",
    },
    {
      kw: "boulder wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Boulder Wall",
    },
    {
      kw: "boulder walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Boulder Wall",
    },
    {
      kw: "block wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Block Wall",
    },
    {
      kw: "block walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Block Wall",
    },
    {
      kw: "brick wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Brick Wall",
    },
    {
      kw: "brick walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Brick Wall",
    },
    {
      kw: "privacy wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Privacy Wall",
    },
    {
      kw: "privacy walls",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Privacy Wall",
    },
    {
      kw: "stone masonry",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Stone Masonry",
    },
    {
      kw: "brick masonry",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Brick Masonry",
    },
    {
      kw: "masonry work",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Masonry Work",
    },
    {
      kw: "masonry services",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Masonry Services",
    },
    {
      kw: "masonry construction",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Masonry Construction",
    },
    {
      kw: "stone installation",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Stone Installation",
    },
    {
      kw: "rock installation",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Rock Installation",
    },
    {
      kw: "boulder installation",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Boulder Installation",
    },
    {
      kw: "concrete block",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Concrete Block",
    },
    {
      kw: "segmental retaining",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Segmental Retaining",
    },
    {
      kw: "allan block",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Allan Block",
    },
    {
      kw: "versa-lok",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Versa-Lok",
    },
    {
      kw: "versalok",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Versa-Lok",
    },
    {
      kw: "natural stone wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Natural Stone Wall",
    },
    {
      kw: "dry stack wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Dry Stack Wall",
    },
    {
      kw: "fieldstone wall",
      category: "walls",
      tier: 2,
      weight: 10,
      label: "Fieldstone Wall",
    },

    // ── Outdoor Living (tier 2) ──
    // NOTE: Generic "outdoor living" phrases have been demoted to tier 4 (weight=1)
    // because they are used by many non-hardscape businesses (furniture stores,
    // realtors, general contractors, etc.). Only specific hardscape structures
    // (fireplaces, fire pits, courtyards) are kept at tier 2.
    {
      kw: "outdoor fireplace",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Outdoor Fireplace",
    },
    {
      kw: "outdoor fireplaces",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Outdoor Fireplace",
    },
    {
      kw: "fire pit installation",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Fire Pit Installation",
    },
    {
      kw: "fire pit design",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Fire Pit Design",
    },
    {
      kw: "fire feature",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Fire Feature",
    },
    {
      kw: "fire features",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Fire Feature",
    },
    {
      kw: "backyard transformation",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Backyard Transformation",
    },
    {
      kw: "backyard transformations",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Backyard Transformation",
    },
    {
      kw: "courtyard",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Courtyard",
    },
    {
      kw: "courtyards",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Courtyard",
    },
    {
      kw: "courtyard design",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Courtyard Design",
    },
    {
      kw: "courtyard installation",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Courtyard Installation",
    },
    // DEMOTED: generic "outdoor living" phrases are now tier 4, weight 1.
    // They may appear on ANY company website and cannot alone indicate hardscaping.
    {
      kw: "outdoor living space",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Living Space",
    },
    {
      kw: "outdoor living spaces",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Living Space",
    },
    {
      kw: "outdoor living area",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Living Area",
    },
    {
      kw: "outdoor living design",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Living Design",
    },
    {
      kw: "outdoor entertainment",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Entertainment",
    },
    {
      kw: "outdoor entertaining",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Entertainment",
    },
    {
      kw: "outdoor renovation",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Renovation",
    },
    {
      kw: "outdoor renovations",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Renovation",
    },
    // "luxury outdoor living" kept at tier 3 (weight=3) — the "luxury" qualifier
    // makes it somewhat more specific, but it still isn't a confirmed hardscape signal.
    {
      kw: "luxury outdoor living",
      category: "outdoor_living",
      tier: 3,
      weight: 3,
      label: "Luxury Outdoor Living",
    },
    {
      kw: "luxury outdoor",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Luxury Outdoor",
    },

    // ── Walkways & Driveways (tier 2) ──
    {
      kw: "walkway installation",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Walkway Installation",
    },
    {
      kw: "walkway installer",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Walkway Installation",
    },
    {
      kw: "paver walkway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Paver Walkway",
    },
    {
      kw: "paver walkways",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Paver Walkway",
    },
    {
      kw: "stone walkway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Stone Walkway",
    },
    {
      kw: "stone walkways",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Stone Walkway",
    },
    {
      kw: "flagstone walkway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Flagstone Walkway",
    },
    {
      kw: "stepping stones",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Stepping Stones",
    },
    {
      kw: "pathway installation",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pathway Installation",
    },
    {
      kw: "pathway design",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pathway Design",
    },
    {
      kw: "driveway installation",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Driveway Installation",
    },
    {
      kw: "paver driveway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Paver Driveway",
    },
    {
      kw: "paver driveways",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Paver Driveway",
    },
    {
      kw: "brick driveway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Brick Driveway",
    },
    {
      kw: "stone driveway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Stone Driveway",
    },
    {
      kw: "pool deck",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Deck",
    },
    {
      kw: "pool decks",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Deck",
    },
    {
      kw: "pool deck installation",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Deck Installation",
    },
    {
      kw: "pool surround",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Surround",
    },
    {
      kw: "pool surrounds",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Surround",
    },
    {
      kw: "pool patio",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Patio",
    },
    {
      kw: "pool coping",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Pool Coping",
    },
    {
      kw: "entryway",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Entryway",
    },
    {
      kw: "entryways",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Entryway",
    },
    {
      kw: "stone steps",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Stone Steps",
    },
    {
      kw: "paver steps",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Paver Steps",
    },
    {
      kw: "entry steps",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Entry Steps",
    },
    {
      kw: "outdoor steps",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Outdoor Steps",
    },
    {
      kw: "stamped concrete",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Stamped Concrete",
    },
    {
      kw: "decorative concrete",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Decorative Concrete",
    },
    {
      kw: "concrete installation",
      category: "walkways_drives",
      tier: 2,
      weight: 10,
      label: "Concrete Installation",
    },

    // ── Water Features & Lighting (tier 2) ──
    {
      kw: "water feature installation",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Water Feature Installation",
    },
    {
      kw: "water feature design",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Water Feature Design",
    },
    {
      kw: "fountain installation",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Fountain Installation",
    },
    {
      kw: "waterfall installation",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Waterfall Installation",
    },
    {
      kw: "waterfall design",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Waterfall Design",
    },
    {
      kw: "pond installation",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Pond Installation",
    },
    {
      kw: "pond construction",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Pond Construction",
    },
    {
      kw: "landscape lighting installation",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Landscape Lighting Installation",
    },
    {
      kw: "outdoor lighting installation",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Outdoor Lighting Installation",
    },
    {
      kw: "outdoor lighting design",
      category: "water_landscape",
      tier: 2,
      weight: 10,
      label: "Outdoor Lighting Design",
    },
    {
      kw: "pergola installation",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Pergola Installation",
    },
    {
      kw: "pergola builder",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Pergola Builder",
    },
    {
      kw: "gazebo installation",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Gazebo Installation",
    },
    {
      kw: "gazebo builder",
      category: "outdoor_living",
      tier: 2,
      weight: 10,
      label: "Gazebo Builder",
    },

    // ── Site Work (tier 2) ──
    {
      kw: "french drain",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "French Drain",
    },
    {
      kw: "french drains",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "French Drain",
    },
    {
      kw: "french drain installation",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "French Drain Installation",
    },
    {
      kw: "drainage solution",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Drainage Solution",
    },
    {
      kw: "drainage solutions",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Drainage Solution",
    },
    {
      kw: "drainage installation",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Drainage Installation",
    },
    {
      kw: "grading and drainage",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Grading and Drainage",
    },
    {
      kw: "excavation contractor",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Excavation Contractor",
    },
    {
      kw: "excavation services",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Excavation Services",
    },
    {
      kw: "site preparation",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Site Preparation",
    },
    {
      kw: "site prep",
      category: "site_work",
      tier: 2,
      weight: 10,
      label: "Site Preparation",
    },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 3 — SUPPORTING SERVICES (weight = 5)
    // ════════════════════════════════════════════════════════════════════════

    { kw: "patio", category: "patios", tier: 3, weight: 5, label: "Patio" },
    { kw: "patios", category: "patios", tier: 3, weight: 5, label: "Patio" },
    {
      kw: "outdoor paving",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Outdoor Paving",
    },
    {
      kw: "stone paving",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Stone Paving",
    },
    {
      kw: "concrete patio",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Concrete Patio",
    },
    {
      kw: "new patio",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "New Patio",
    },
    {
      kw: "patio project",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Patio Project",
    },
    {
      kw: "patio projects",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Patio Projects",
    },
    {
      kw: "patio gallery",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Patio Gallery",
    },
    {
      kw: "backyard patio",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Backyard Patio",
    },
    {
      kw: "patio space",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Patio Space",
    },
    {
      kw: "patio ideas",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Patio Ideas",
    },
    {
      kw: "travertine",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Travertine",
    },
    {
      kw: "bluestone",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Bluestone",
    },
    {
      kw: "cobblestone",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Cobblestone",
    },
    {
      kw: "fieldstone",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Fieldstone",
    },
    {
      kw: "quartzite",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Quartzite",
    },
    {
      kw: "slate",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Slate Stone",
    },
    {
      kw: "natural stone",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Natural Stone",
    },
    {
      kw: "flagstone",
      category: "patios",
      tier: 3,
      weight: 5,
      label: "Flagstone",
    },
    {
      kw: "wall installation",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Wall Installation",
    },
    {
      kw: "wall construction",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Wall Construction",
    },
    {
      kw: "wall builder",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Wall Builder",
    },
    {
      kw: "stone work",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Stone Work",
    },
    {
      kw: "stonework",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Stonework",
    },
    {
      kw: "brick work",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Brick Work",
    },
    {
      kw: "brickwork",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Brickwork",
    },
    { kw: "masonry", category: "walls", tier: 3, weight: 5, label: "Masonry" },
    { kw: "mason", category: "walls", tier: 3, weight: 5, label: "Mason" },
    {
      kw: "stone veneer",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Stone Veneer",
    },
    {
      kw: "landscape wall",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Landscape Wall",
    },
    {
      kw: "landscape walls",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Landscape Wall",
    },
    {
      kw: "erosion control",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Erosion Control",
    },
    {
      kw: "slope stabilization",
      category: "walls",
      tier: 3,
      weight: 5,
      label: "Slope Stabilization",
    },
    // DEMOTED: "outdoor living" alone is used by furniture stores, realtors,
    // general contractors, and many others. Weight reduced to near-zero.
    {
      kw: "outdoor living",
      category: "outdoor_living",
      tier: 4,
      weight: 1,
      label: "Outdoor Living",
    },
    {
      kw: "fire pit",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Fire Pit",
    },
    {
      kw: "fire pits",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Fire Pit",
    },
    {
      kw: "fireplace installation",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Fireplace Installation",
    },
    {
      kw: "pergola",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Pergola",
    },
    {
      kw: "pergolas",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Pergola",
    },
    {
      kw: "gazebo",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Gazebo",
    },
    {
      kw: "gazebos",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Gazebo",
    },
    {
      kw: "arbor",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Arbor",
    },
    {
      kw: "trellis",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Trellis",
    },
    {
      kw: "outdoor structure",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Outdoor Structure",
    },
    {
      kw: "outdoor structures",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Outdoor Structure",
    },
    {
      kw: "backyard design",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Backyard Design",
    },
    {
      kw: "backyard renovation",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Backyard Renovation",
    },
    {
      kw: "outdoor bar",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Outdoor Bar",
    },
    {
      kw: "pizza oven",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Pizza Oven",
    },
    {
      kw: "grill station",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Grill Station",
    },
    {
      kw: "built-in grill",
      category: "outdoor_living",
      tier: 3,
      weight: 5,
      label: "Built-in Grill",
    },
    {
      kw: "walkway",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Walkway",
    },
    {
      kw: "walkways",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Walkway",
    },
    {
      kw: "pathway",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Pathway",
    },
    {
      kw: "pathways",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Pathway",
    },
    {
      kw: "driveway",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Driveway",
    },
    {
      kw: "driveways",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Driveway",
    },
    {
      kw: "concrete driveway",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Concrete Driveway",
    },
    {
      kw: "asphalt driveway",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Asphalt Driveway",
    },
    {
      kw: "steps installation",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Steps Installation",
    },
    {
      kw: "concrete steps",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Concrete Steps",
    },
    {
      kw: "staircase",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Staircase",
    },
    {
      kw: "outdoor stairs",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Outdoor Stairs",
    },
    {
      kw: "front walkway",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Front Walkway",
    },
    {
      kw: "front walk",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Front Walk",
    },
    {
      kw: "exposed aggregate",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Exposed Aggregate",
    },
    {
      kw: "concrete overlay",
      category: "walkways_drives",
      tier: 3,
      weight: 5,
      label: "Concrete Overlay",
    },
    {
      kw: "water feature",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Water Feature",
    },
    {
      kw: "water features",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Water Feature",
    },
    {
      kw: "fountain",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Fountain",
    },
    {
      kw: "fountains",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Fountain",
    },
    {
      kw: "waterfall",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Waterfall",
    },
    {
      kw: "waterfalls",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Waterfall",
    },
    {
      kw: "pondless waterfall",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Pondless Waterfall",
    },
    {
      kw: "pond",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Pond",
    },
    {
      kw: "koi pond",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Koi Pond",
    },
    {
      kw: "landscape lighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Landscape Lighting",
    },
    {
      kw: "outdoor lighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Outdoor Lighting",
    },
    {
      kw: "low voltage lighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Low Voltage Lighting",
    },
    {
      kw: "led landscape lighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "LED Landscape Lighting",
    },
    {
      kw: "pathway lighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Pathway Lighting",
    },
    {
      kw: "uplighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Uplighting",
    },
    {
      kw: "downlighting",
      category: "water_landscape",
      tier: 3,
      weight: 5,
      label: "Downlighting",
    },
    {
      kw: "drainage",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Drainage",
    },
    {
      kw: "grading",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Grading",
    },
    {
      kw: "excavation",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Excavation",
    },
    {
      kw: "land grading",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Land Grading",
    },
    {
      kw: "yard grading",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Yard Grading",
    },
    {
      kw: "trench drain",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Trench Drain",
    },
    {
      kw: "channel drain",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Channel Drain",
    },
    {
      kw: "surface drain",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Surface Drain",
    },
    {
      kw: "catch basin",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Catch Basin",
    },
    {
      kw: "dry creek bed",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Dry Creek Bed",
    },
    {
      kw: "dry creek",
      category: "site_work",
      tier: 3,
      weight: 5,
      label: "Dry Creek",
    },
    { kw: "swale", category: "site_work", tier: 3, weight: 5, label: "Swale" },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 4 — CONTEXTUAL SIGNALS (weight = 2)
    // ════════════════════════════════════════════════════════════════════════
    {
      kw: "hardscape",
      category: "patios",
      tier: 4,
      weight: 2,
      label: "Hardscape",
    },
    {
      kw: "hardscaping",
      category: "patios",
      tier: 4,
      weight: 2,
      label: "Hardscaping",
    },
    { kw: "pavers", category: "patios", tier: 4, weight: 2, label: "Pavers" },
    { kw: "paver", category: "patios", tier: 4, weight: 2, label: "Paver" },
    {
      kw: "landscape contractor",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Landscape Contractor",
    },
    {
      kw: "landscape company",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Landscape Company",
    },
    {
      kw: "landscaping contractor",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Landscaping Contractor",
    },
    {
      kw: "landscaping company",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Landscaping Company",
    },
    {
      kw: "outdoor design",
      category: "outdoor_living",
      tier: 4,
      weight: 2,
      label: "Outdoor Design",
    },
    {
      kw: "concrete work",
      category: "walkways_drives",
      tier: 4,
      weight: 2,
      label: "Concrete Work",
    },
    {
      kw: "concrete contractor",
      category: "walkways_drives",
      tier: 4,
      weight: 2,
      label: "Concrete Contractor",
    },
    {
      kw: "concrete company",
      category: "walkways_drives",
      tier: 4,
      weight: 2,
      label: "Concrete Company",
    },
    {
      kw: "curb appeal",
      category: "patios",
      tier: 4,
      weight: 2,
      label: "Curb Appeal",
    },
    {
      kw: "landscaping services",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Landscaping Services",
    },
    {
      kw: "landscape design",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Landscape Design",
    },
    // DEMOTED: "outdoor spaces" / "outdoor space" are extremely generic — weight 0 (excluded).
    // Any business can use these phrases (furniture stores, real estate, etc.).
    // They are kept in the lexicon with weight=0 so they appear in evidence
    // but contribute nothing to the score.
    {
      kw: "outdoor spaces",
      category: "outdoor_living",
      tier: 4,
      weight: 0,
      label: "Outdoor Spaces",
    },
    {
      kw: "outdoor space",
      category: "outdoor_living",
      tier: 4,
      weight: 0,
      label: "Outdoor Space",
    },
    {
      kw: "free estimate",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Free Estimate",
    },
    {
      kw: "free consultation",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Free Consultation",
    },
    {
      kw: "licensed and insured",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Licensed & Insured",
    },
    {
      kw: "family owned",
      category: "site_work",
      tier: 4,
      weight: 2,
      label: "Family Owned",
    },
  ];

  // ── HARDSCAPE NEGATIVE KEYWORDS (PENALTY = −10 pts each) ─────────────────
  const HARDSCAPE_NEGATIVE_KEYWORDS = [
    "lawn mowing",
    "grass cutting",
    "lawn cutting",
    "grass mowing",
    "mow the lawn",
    "mowing service",
    "mowing services",
    "lawn mowing service",
    "regular mowing",
    "weekly mowing",
    "bi-weekly mowing",
    "lawn care service",
    "lawn care services",
    "lawn service",
    "lawn services",
    "lawn maintenance",
    "fertilization",
    "fertilization service",
    "lawn fertilization",
    "lawn fertilizer",
    "weed control",
    "weed management",
    "weed killing",
    "broadleaf control",
    "crabgrass control",
    "pre-emergent",
    "herbicide application",
    "sprinkler repair",
    "sprinkler installation",
    "sprinkler system",
    "sprinkler systems",
    "irrigation repair",
    "irrigation installation",
    "irrigation service",
    "irrigation services",
    "irrigation contractor",
    "irrigation company",
    "drip irrigation",
    "irrigation only",
    "arborist",
    "certified arborist",
    "tree trimming",
    "tree pruning",
    "tree removal",
    "tree service",
    "tree services",
    "tree care",
    "stump removal",
    "stump grinding",
    "tree surgery",
    "tree surgeon",
    "garden maintenance",
    "garden care",
    "garden weeding",
    "planting service",
    "flower bed maintenance",
    "mulching service",
    "mulch installation",
    "snow removal",
    "snow plowing",
    "snow plow",
    "snow plowing service",
    "ice removal",
    "de-icing service",
    "aeration service",
    "aeration and overseeding",
    "overseeding",
    "lawn aeration",
    "pest control",
    "lawn pest control",
    "mosquito control",
    "gutter cleaning",
    "gutter cleaning service",
    "power washing only",
  ];

  // ── HARDSCAPE SECONDARY KEYWORDS ─────────────────────────────────────────
  const SECONDARY_KEYWORDS = [
    { kw: "landscaping", label: "General Landscaping" },
    { kw: "lawn care", label: "Lawn Care" },
    { kw: "fencing", label: "Fencing" },
    { kw: "fence installation", label: "Fence Installation" },
    { kw: "irrigation", label: "Irrigation" },
    { kw: "sprinkler", label: "Sprinkler System" },
    { kw: "sod installation", label: "Sod Installation" },
    { kw: "mulching", label: "Mulching" },
    { kw: "tree service", label: "Tree Service" },
    { kw: "snow removal", label: "Snow Removal" },
    { kw: "painting", label: "Painting" },
    { kw: "power washing", label: "Power Washing" },
    { kw: "pressure washing", label: "Pressure Washing" },
    { kw: "deck building", label: "Deck Building" },
    { kw: "deck installation", label: "Deck Installation" },
    { kw: "deck contractor", label: "Deck Contractor" },
    { kw: "wooden deck", label: "Wooden Deck" },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION B: HVAC KEYWORD LEXICON (NEW)
  // ══════════════════════════════════════════════════════════════════════════

  const HVAC_KEYWORDS = [
    // ════════════════════════════════════════════════════════════════════════
    // TIER 1 — HVAC CONTRACTOR IDENTITY (weight = 15)
    // These terms confirm a primary HVAC service company. High precision.
    // ════════════════════════════════════════════════════════════════════════

    // ── Core Identity Terms ──
    {
      kw: "hvac contractor",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Contractor",
    },
    {
      kw: "hvac contractors",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Contractor",
    },
    {
      kw: "hvac company",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Company",
    },
    {
      kw: "hvac services",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Services",
    },
    {
      kw: "hvac service company",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Service Company",
    },
    {
      kw: "hvac technician",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Technician",
    },
    {
      kw: "hvac technicians",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Technician",
    },
    {
      kw: "hvac specialist",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Specialist",
    },
    {
      kw: "hvac repair",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Repair",
    },
    {
      kw: "hvac installation",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Installation",
    },
    {
      kw: "hvac replacement",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "HVAC Replacement",
    },
    {
      kw: "hvac maintenance",
      category: "maintenance",
      tier: 1,
      weight: 15,
      label: "HVAC Maintenance",
    },
    {
      kw: "air conditioning contractor",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioning Contractor",
    },
    {
      kw: "air conditioning company",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioning Company",
    },
    {
      kw: "heating contractor",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Heating Contractor",
    },
    {
      kw: "heating company",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Heating Company",
    },
    {
      kw: "cooling contractor",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Cooling Contractor",
    },
    {
      kw: "mechanical contractor",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Mechanical Contractor",
    },
    {
      kw: "mechanical contractors",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Mechanical Contractor",
    },
    {
      kw: "mechanical services",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Mechanical Services",
    },

    // ── Furnace Services (Tier 1) ──
    {
      kw: "furnace installation",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Installation",
    },
    {
      kw: "furnace installations",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Installation",
    },
    {
      kw: "furnace repair",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Repair",
    },
    {
      kw: "furnace replacement",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Replacement",
    },
    {
      kw: "furnace contractor",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Contractor",
    },
    {
      kw: "furnace service",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Service",
    },
    {
      kw: "furnace services",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Furnace Service",
    },

    // ── AC Services (Tier 1) ──
    {
      kw: "ac repair",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "AC Repair",
    },
    {
      kw: "ac installation",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "AC Installation",
    },
    {
      kw: "ac replacement",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "AC Replacement",
    },
    {
      kw: "ac contractor",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "AC Contractor",
    },
    {
      kw: "ac service",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "AC Service",
    },
    {
      kw: "ac services",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "AC Service",
    },
    {
      kw: "air conditioner repair",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioner Repair",
    },
    {
      kw: "air conditioner installation",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioner Installation",
    },
    {
      kw: "air conditioner replacement",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioner Replacement",
    },
    {
      kw: "air conditioning repair",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioning Repair",
    },
    {
      kw: "air conditioning installation",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioning Installation",
    },
    {
      kw: "air conditioning replacement",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioning Replacement",
    },
    {
      kw: "air conditioning service",
      category: "cooling",
      tier: 1,
      weight: 15,
      label: "Air Conditioning Service",
    },

    // ── Heat Pump Services (Tier 1) ──
    {
      kw: "heat pump installation",
      category: "heat_pumps",
      tier: 1,
      weight: 15,
      label: "Heat Pump Installation",
    },
    {
      kw: "heat pump repair",
      category: "heat_pumps",
      tier: 1,
      weight: 15,
      label: "Heat Pump Repair",
    },
    {
      kw: "heat pump replacement",
      category: "heat_pumps",
      tier: 1,
      weight: 15,
      label: "Heat Pump Replacement",
    },
    {
      kw: "heat pump service",
      category: "heat_pumps",
      tier: 1,
      weight: 15,
      label: "Heat Pump Service",
    },
    {
      kw: "heat pump contractor",
      category: "heat_pumps",
      tier: 1,
      weight: 15,
      label: "Heat Pump Contractor",
    },

    // ── Boiler Services (Tier 1) ──
    {
      kw: "boiler installation",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Boiler Installation",
    },
    {
      kw: "boiler repair",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Boiler Repair",
    },
    {
      kw: "boiler replacement",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Boiler Replacement",
    },
    {
      kw: "boiler service",
      category: "heating",
      tier: 1,
      weight: 15,
      label: "Boiler Service",
    },

    // ── Duct Services (Tier 1) ──
    {
      kw: "duct cleaning",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Duct Cleaning",
    },
    {
      kw: "duct repair",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Duct Repair",
    },
    {
      kw: "duct installation",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Duct Installation",
    },
    {
      kw: "duct replacement",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Duct Replacement",
    },
    {
      kw: "duct sealing",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Duct Sealing",
    },
    {
      kw: "air duct cleaning",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Air Duct Cleaning",
    },
    {
      kw: "air duct repair",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Air Duct Repair",
    },
    {
      kw: "air duct installation",
      category: "ductwork",
      tier: 1,
      weight: 15,
      label: "Air Duct Installation",
    },

    // ── Emergency Services (Tier 1) ──
    {
      kw: "emergency hvac",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "Emergency HVAC",
    },
    {
      kw: "emergency ac repair",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "Emergency AC Repair",
    },
    {
      kw: "emergency heating repair",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "Emergency Heating Repair",
    },
    {
      kw: "emergency furnace repair",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "Emergency Furnace Repair",
    },
    {
      kw: "24/7 hvac",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "24/7 HVAC Service",
    },
    {
      kw: "24 hour hvac",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "24/7 HVAC Service",
    },
    {
      kw: "same-day hvac",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "Same-Day HVAC Service",
    },
    {
      kw: "same day hvac",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "Same-Day HVAC Service",
    },
    {
      kw: "after-hours hvac",
      category: "emergency",
      tier: 1,
      weight: 15,
      label: "After-Hours HVAC",
    },

    // ── Commercial HVAC (Tier 1) ──
    {
      kw: "commercial hvac",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Commercial HVAC",
    },
    {
      kw: "commercial hvac contractor",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Commercial HVAC Contractor",
    },
    {
      kw: "commercial air conditioning",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Commercial Air Conditioning",
    },
    {
      kw: "commercial heating",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Commercial Heating",
    },
    {
      kw: "commercial cooling",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Commercial Cooling",
    },
    {
      kw: "commercial furnace",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Commercial Furnace",
    },
    {
      kw: "industrial hvac",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Industrial HVAC",
    },
    {
      kw: "rooftop unit installation",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Rooftop Unit (RTU) Installation",
    },
    {
      kw: "rooftop unit repair",
      category: "commercial_hvac",
      tier: 1,
      weight: 15,
      label: "Rooftop Unit (RTU) Repair",
    },

    // ── Commercial Refrigeration (Tier 1) ──
    {
      kw: "commercial refrigeration",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Commercial Refrigeration",
    },
    {
      kw: "refrigeration repair",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Refrigeration Repair",
    },
    {
      kw: "refrigeration installation",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Refrigeration Installation",
    },
    {
      kw: "walk-in cooler repair",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Walk-in Cooler Repair",
    },
    {
      kw: "walk-in freezer repair",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Walk-in Freezer Repair",
    },
    {
      kw: "restaurant refrigeration",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Restaurant Refrigeration",
    },
    {
      kw: "ice machine repair",
      category: "refrigeration",
      tier: 1,
      weight: 15,
      label: "Ice Machine Repair",
    },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 2 — STRONG HVAC SERVICE TERMS (weight = 10)
    // ════════════════════════════════════════════════════════════════════════

    // ── Heating (Tier 2) ──
    {
      kw: "furnace maintenance",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Furnace Maintenance",
    },
    {
      kw: "furnace tune-up",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Furnace Tune-Up",
    },
    {
      kw: "furnace tune up",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Furnace Tune-Up",
    },
    {
      kw: "gas furnace",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Gas Furnace",
    },
    {
      kw: "electric furnace",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Electric Furnace",
    },
    {
      kw: "heating system installation",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Heating System Installation",
    },
    {
      kw: "heating system repair",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Heating System Repair",
    },
    {
      kw: "heating system replacement",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Heating System Replacement",
    },
    {
      kw: "heating system maintenance",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Heating System Maintenance",
    },
    {
      kw: "radiant heating",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Radiant Heating",
    },
    {
      kw: "baseboard heating",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Baseboard Heating",
    },
    {
      kw: "heat pump heating",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Heat Pump Heating",
    },
    {
      kw: "boiler maintenance",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Boiler Maintenance",
    },
    {
      kw: "boiler tune-up",
      category: "heating",
      tier: 2,
      weight: 10,
      label: "Boiler Tune-Up",
    },

    // ── Cooling (Tier 2) ──
    {
      kw: "ac maintenance",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "AC Maintenance",
    },
    {
      kw: "ac tune-up",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "AC Tune-Up",
    },
    {
      kw: "ac tune up",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "AC Tune-Up",
    },
    {
      kw: "central air conditioning",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Central Air Conditioning",
    },
    {
      kw: "central air installation",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Central Air Installation",
    },
    {
      kw: "ductless ac",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Ductless AC",
    },
    {
      kw: "mini split installation",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Mini-Split Installation",
    },
    {
      kw: "mini split repair",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Mini-Split Repair",
    },
    {
      kw: "mini-split installation",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Mini-Split Installation",
    },
    {
      kw: "mini-split repair",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Mini-Split Repair",
    },
    {
      kw: "split system",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Split System",
    },
    {
      kw: "residential ac",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Residential AC",
    },
    {
      kw: "cooling system installation",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Cooling System Installation",
    },
    {
      kw: "cooling system repair",
      category: "cooling",
      tier: 2,
      weight: 10,
      label: "Cooling System Repair",
    },

    // ── Heat Pumps (Tier 2) ──
    {
      kw: "heat pump maintenance",
      category: "heat_pumps",
      tier: 2,
      weight: 10,
      label: "Heat Pump Maintenance",
    },
    {
      kw: "ductless heat pump",
      category: "heat_pumps",
      tier: 2,
      weight: 10,
      label: "Ductless Heat Pump",
    },
    {
      kw: "air source heat pump",
      category: "heat_pumps",
      tier: 2,
      weight: 10,
      label: "Air Source Heat Pump",
    },
    {
      kw: "geothermal heat pump",
      category: "heat_pumps",
      tier: 2,
      weight: 10,
      label: "Geothermal Heat Pump",
    },
    {
      kw: "geothermal system",
      category: "heat_pumps",
      tier: 2,
      weight: 10,
      label: "Geothermal System",
    },
    {
      kw: "heat pump tune-up",
      category: "heat_pumps",
      tier: 2,
      weight: 10,
      label: "Heat Pump Tune-Up",
    },

    // ── Indoor Air Quality (Tier 2) ──
    {
      kw: "indoor air quality",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Indoor Air Quality",
    },
    {
      kw: "air purification",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Air Purification",
    },
    {
      kw: "air purifier installation",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Air Purifier Installation",
    },
    {
      kw: "air filtration",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Air Filtration",
    },
    {
      kw: "hepa filtration",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "HEPA Filtration",
    },
    {
      kw: "uv air purification",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "UV Air Purification",
    },
    {
      kw: "whole-home humidifier",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Whole-Home Humidifier",
    },
    {
      kw: "whole-home dehumidifier",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Whole-Home Dehumidifier",
    },
    {
      kw: "whole home humidifier",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Whole-Home Humidifier",
    },
    {
      kw: "whole home dehumidifier",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Whole-Home Dehumidifier",
    },
    {
      kw: "air quality testing",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Air Quality Testing",
    },
    {
      kw: "ventilation system",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Ventilation System",
    },
    {
      kw: "ventilation systems",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Ventilation System",
    },
    {
      kw: "air cleaner installation",
      category: "indoor_air_quality",
      tier: 2,
      weight: 10,
      label: "Air Cleaner Installation",
    },

    // ── Ductwork (Tier 2) ──
    {
      kw: "ductwork installation",
      category: "ductwork",
      tier: 2,
      weight: 10,
      label: "Ductwork Installation",
    },
    {
      kw: "ductwork repair",
      category: "ductwork",
      tier: 2,
      weight: 10,
      label: "Ductwork Repair",
    },
    {
      kw: "ductwork replacement",
      category: "ductwork",
      tier: 2,
      weight: 10,
      label: "Ductwork Replacement",
    },
    {
      kw: "air balancing",
      category: "ductwork",
      tier: 2,
      weight: 10,
      label: "Air Balancing",
    },

    // ── Maintenance (Tier 2) ──
    {
      kw: "hvac tune-up",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "HVAC Tune-Up",
    },
    {
      kw: "hvac tune up",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "HVAC Tune-Up",
    },
    {
      kw: "cooling maintenance",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Cooling Maintenance",
    },
    {
      kw: "heating maintenance",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Heating Maintenance",
    },
    {
      kw: "preventive maintenance",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Preventive Maintenance",
    },
    {
      kw: "hvac maintenance plan",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "HVAC Maintenance Plan",
    },
    {
      kw: "maintenance agreement",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "HVAC Maintenance Agreement",
    },
    {
      kw: "service agreement",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Service Agreement",
    },
    {
      kw: "annual hvac service",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Annual HVAC Service",
    },
    {
      kw: "seasonal tune-up",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Seasonal Tune-Up",
    },
    {
      kw: "seasonal tune up",
      category: "maintenance",
      tier: 2,
      weight: 10,
      label: "Seasonal Tune-Up",
    },

    // ── Commercial HVAC (Tier 2) ──
    {
      kw: "rooftop unit",
      category: "commercial_hvac",
      tier: 2,
      weight: 10,
      label: "Rooftop Unit (RTU)",
    },
    {
      kw: "building hvac",
      category: "commercial_hvac",
      tier: 2,
      weight: 10,
      label: "Building HVAC",
    },
    {
      kw: "commercial ventilation",
      category: "commercial_hvac",
      tier: 2,
      weight: 10,
      label: "Commercial Ventilation",
    },
    {
      kw: "commercial refrigeration service",
      category: "commercial_hvac",
      tier: 2,
      weight: 10,
      label: "Commercial Refrigeration Service",
    },
    {
      kw: "commercial air handler",
      category: "commercial_hvac",
      tier: 2,
      weight: 10,
      label: "Commercial Air Handler",
    },

    // ── Refrigeration (Tier 2) ──
    {
      kw: "walk-in cooler",
      category: "refrigeration",
      tier: 2,
      weight: 10,
      label: "Walk-in Cooler",
    },
    {
      kw: "walk-in freezer",
      category: "refrigeration",
      tier: 2,
      weight: 10,
      label: "Walk-in Freezer",
    },
    {
      kw: "refrigeration maintenance",
      category: "refrigeration",
      tier: 2,
      weight: 10,
      label: "Refrigeration Maintenance",
    },
    {
      kw: "ice machine installation",
      category: "refrigeration",
      tier: 2,
      weight: 10,
      label: "Ice Machine Installation",
    },
    {
      kw: "reach-in refrigerator repair",
      category: "refrigeration",
      tier: 2,
      weight: 10,
      label: "Reach-in Refrigerator Repair",
    },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 3 — SUPPORTING HVAC SIGNALS (weight = 5)
    // ════════════════════════════════════════════════════════════════════════

    // ── Heating (Tier 3) ──
    {
      kw: "furnace",
      category: "heating",
      tier: 3,
      weight: 5,
      label: "Furnace",
    },
    { kw: "boiler", category: "heating", tier: 3, weight: 5, label: "Boiler" },
    {
      kw: "heating system",
      category: "heating",
      tier: 3,
      weight: 5,
      label: "Heating System",
    },
    {
      kw: "heating and cooling",
      category: "heating",
      tier: 3,
      weight: 5,
      label: "Heating & Cooling",
    },
    {
      kw: "heating & cooling",
      category: "heating",
      tier: 3,
      weight: 5,
      label: "Heating & Cooling",
    },
    {
      kw: "heating services",
      category: "heating",
      tier: 3,
      weight: 5,
      label: "Heating Services",
    },

    // ── Cooling (Tier 3) ──
    {
      kw: "air conditioning",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Air Conditioning",
    },
    {
      kw: "air conditioner",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Air Conditioner",
    },
    {
      kw: "air conditioners",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Air Conditioner",
    },
    {
      kw: "cooling system",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Cooling System",
    },
    {
      kw: "cooling services",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Cooling Services",
    },
    {
      kw: "mini split",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Mini-Split",
    },
    {
      kw: "mini-split",
      category: "cooling",
      tier: 3,
      weight: 5,
      label: "Mini-Split",
    },

    // ── Heat Pumps (Tier 3) ──
    {
      kw: "heat pump",
      category: "heat_pumps",
      tier: 3,
      weight: 5,
      label: "Heat Pump",
    },
    {
      kw: "heat pumps",
      category: "heat_pumps",
      tier: 3,
      weight: 5,
      label: "Heat Pump",
    },

    // ── Indoor Air Quality (Tier 3) ──
    {
      kw: "humidifier",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Humidifier",
    },
    {
      kw: "dehumidifier",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Dehumidifier",
    },
    {
      kw: "air cleaner",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Air Cleaner",
    },
    {
      kw: "air cleaners",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Air Cleaner",
    },
    {
      kw: "air filter",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Air Filter",
    },
    {
      kw: "air filters",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Air Filter",
    },
    {
      kw: "ventilation",
      category: "indoor_air_quality",
      tier: 3,
      weight: 5,
      label: "Ventilation",
    },

    // ── Ductwork (Tier 3) ──
    {
      kw: "ductwork",
      category: "ductwork",
      tier: 3,
      weight: 5,
      label: "Ductwork",
    },
    {
      kw: "duct work",
      category: "ductwork",
      tier: 3,
      weight: 5,
      label: "Ductwork",
    },
    {
      kw: "air ducts",
      category: "ductwork",
      tier: 3,
      weight: 5,
      label: "Air Ducts",
    },
    {
      kw: "hvac ducts",
      category: "ductwork",
      tier: 3,
      weight: 5,
      label: "HVAC Ducts",
    },

    // ── Maintenance (Tier 3) ──
    {
      kw: "preventative maintenance",
      category: "maintenance",
      tier: 3,
      weight: 5,
      label: "Preventative Maintenance",
    },
    {
      kw: "annual maintenance",
      category: "maintenance",
      tier: 3,
      weight: 5,
      label: "Annual Maintenance",
    },
    {
      kw: "maintenance plan",
      category: "maintenance",
      tier: 3,
      weight: 5,
      label: "Maintenance Plan",
    },

    // ── Emergency (Tier 3) ──
    {
      kw: "24/7 service",
      category: "emergency",
      tier: 3,
      weight: 5,
      label: "24/7 Service",
    },
    {
      kw: "after hours service",
      category: "emergency",
      tier: 3,
      weight: 5,
      label: "After-Hours Service",
    },
    {
      kw: "emergency service",
      category: "emergency",
      tier: 3,
      weight: 5,
      label: "Emergency Service",
    },
    {
      kw: "emergency services",
      category: "emergency",
      tier: 3,
      weight: 5,
      label: "Emergency Services",
    },

    // ── Commercial (Tier 3) ──
    {
      kw: "rtu",
      category: "commercial_hvac",
      tier: 3,
      weight: 5,
      label: "RTU",
    },
    {
      kw: "commercial building",
      category: "commercial_hvac",
      tier: 3,
      weight: 5,
      label: "Commercial Building HVAC",
    },

    // ── Refrigeration (Tier 3) ──
    {
      kw: "refrigeration",
      category: "refrigeration",
      tier: 3,
      weight: 5,
      label: "Refrigeration",
    },
    {
      kw: "walk-in coolers",
      category: "refrigeration",
      tier: 3,
      weight: 5,
      label: "Walk-in Coolers",
    },
    {
      kw: "walk-in freezers",
      category: "refrigeration",
      tier: 3,
      weight: 5,
      label: "Walk-in Freezers",
    },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 4 — CONTEXTUAL HVAC SIGNALS (weight = 2)
    // ════════════════════════════════════════════════════════════════════════

    { kw: "hvac", category: "cooling", tier: 4, weight: 2, label: "HVAC" },
    {
      kw: "heating ventilation air conditioning",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "HVAC",
    },
    {
      kw: "heating, ventilation and air conditioning",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "HVAC",
    },
    {
      kw: "climate control",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Climate Control",
    },
    {
      kw: "temperature control",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Temperature Control",
    },
    {
      kw: "comfort systems",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Comfort Systems",
    },
    {
      kw: "comfort system",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Comfort System",
    },
    {
      kw: "indoor comfort",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Indoor Comfort",
    },
    {
      kw: "home comfort",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Home Comfort",
    },
    {
      kw: "licensed hvac",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Licensed HVAC",
    },
    {
      kw: "free hvac estimate",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Free HVAC Estimate",
    },
    {
      kw: "free estimate",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Free Estimate",
    },
    {
      kw: "licensed and insured",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Licensed & Insured",
    },
    {
      kw: "family owned",
      category: "cooling",
      tier: 4,
      weight: 2,
      label: "Family Owned",
    },
  ];

  // ── HVAC NEGATIVE KEYWORDS (PENALTY = −10 pts each) ──────────────────────
  // These suggest the site is NOT an HVAC service contractor
  const HVAC_NEGATIVE_KEYWORDS = [
    // Equipment manufacturer/distributor signals
    "hvac equipment manufacturer",
    "hvac manufacturer",
    "hvac equipment distributor",
    "hvac distributor",
    "wholesale hvac",
    "hvac parts supplier",
    "hvac parts store",
    "hvac supplies",
    "hvac supply",
    "hvac wholesaler",
    "hvac wholesale",
    "hvac product retailer",
    "hvac equipment retailer",
    // Non-service contexts
    "hvac school",
    "hvac training",
    "hvac certification program",
    "hvac courses",
    "hvac degree",
    "hvac program",
    // Unrelated primary businesses (only when HVAC is incidental)
    "lawn mowing",
    "grass cutting",
    "lawn mowing service",
    "roofing contractor",
    "roofing company",
    "roofing services",
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION B2: ROOFING KEYWORD LEXICON
  // ══════════════════════════════════════════════════════════════════════════
  // Tier 1 (weight=15): Dedicated core roofing contractor identity & primary services
  //                     (installation, replacement, repair, inspection, shingle, metal, commercial, residential)
  // Tier 2 (weight=10): Strong supporting roofing service phrases & materials
  // Tier 3 (weight=4):  Supporting roofing terminology
  // Tier 4 (weight=1-2): Contextual / ancillary signals (low weight, cannot trigger strong signal alone)
  // Negative (weight=−10): Non-roofing business signals (pressure washing, solar, windows, siding, inspections, etc.)

  const ROOFING_KEYWORDS = [
    // ════════════════════════════════════════════════════════════════════════
    // TIER 1 — CORE ROOFING CONTRACTOR IDENTITY & DEDICATED SERVICES (weight = 15)
    // ════════════════════════════════════════════════════════════════════════
    // Contractor Identity
    { kw: "roofing contractor", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Contractor" },
    { kw: "roofing contractors", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Contractor" },
    { kw: "roofing company", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Company" },
    { kw: "roofing companies", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Company" },
    { kw: "roof contractor", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Contractor" },
    { kw: "roof contractors", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Contractor" },
    { kw: "licensed roofing contractor", category: "roof_replacement", tier: 1, weight: 15, label: "Licensed Roofing Contractor" },
    { kw: "certified roofing contractor", category: "roof_replacement", tier: 1, weight: 15, label: "Certified Roofing Contractor" },
    { kw: "licensed roofer", category: "roof_replacement", tier: 1, weight: 15, label: "Licensed Roofer" },
    { kw: "certified roofer", category: "roof_replacement", tier: 1, weight: 15, label: "Certified Roofer" },
    { kw: "insured roofer", category: "roof_replacement", tier: 1, weight: 15, label: "Insured Roofer" },
    { kw: "roofing specialist", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Specialist" },
    { kw: "roofing specialists", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Specialist" },
    { kw: "roofing expert", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Expert" },
    { kw: "roofing experts", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Expert" },
    { kw: "roofing professional", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Professional" },
    { kw: "roofing professionals", category: "roof_replacement", tier: 1, weight: 15, label: "Roofing Professional" },
    { kw: "roofing services", category: "roof_installation", tier: 1, weight: 15, label: "Roofing Services" },
    { kw: "roofing service", category: "roof_installation", tier: 1, weight: 15, label: "Roofing Services" },

    // Roof Installation (Dedicated Primary Service)
    { kw: "roof installation services", category: "roof_installation", tier: 1, weight: 15, label: "Roof Installation Services" },
    { kw: "roof installation", category: "roof_installation", tier: 1, weight: 15, label: "Roof Installation" },
    { kw: "roof installations", category: "roof_installation", tier: 1, weight: 15, label: "Roof Installation" },
    { kw: "new roof installation", category: "roof_installation", tier: 1, weight: 15, label: "New Roof Installation" },
    { kw: "residential roofing services", category: "roof_installation", tier: 1, weight: 15, label: "Residential Roofing Services" },
    { kw: "residential roof installation", category: "roof_installation", tier: 1, weight: 15, label: "Residential Roof Installation" },
    { kw: "residential roofing", category: "roof_installation", tier: 1, weight: 15, label: "Residential Roofing" },
    { kw: "roofing solutions", category: "roof_installation", tier: 1, weight: 15, label: "Roofing Solutions" },
    { kw: "roofing systems", category: "roof_installation", tier: 1, weight: 15, label: "Roofing Systems" },

    // Roof Replacement (Dedicated Primary Service)
    { kw: "roof replacement services", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Replacement Services" },
    { kw: "roof replacement contractor", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Replacement Contractor" },
    { kw: "roof replacement", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Replacement" },
    { kw: "roof replacements", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Replacement" },
    { kw: "re-roofing services", category: "roof_replacement", tier: 1, weight: 15, label: "Re-Roofing" },
    { kw: "re-roofing", category: "roof_replacement", tier: 1, weight: 15, label: "Re-Roofing" },
    { kw: "reroofing", category: "roof_replacement", tier: 1, weight: 15, label: "Re-Roofing" },
    { kw: "re-roof", category: "roof_replacement", tier: 1, weight: 15, label: "Re-Roofing" },
    { kw: "reroof", category: "roof_replacement", tier: 1, weight: 15, label: "Re-Roofing" },
    { kw: "roof tear-off", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Tear-Off" },
    { kw: "roof tear off", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Tear-Off" },
    { kw: "roof restoration", category: "roof_replacement", tier: 1, weight: 15, label: "Roof Restoration" },
    { kw: "residential roof replacement", category: "roof_replacement", tier: 1, weight: 15, label: "Residential Roof Replacement" },

    // Roof Repair (Dedicated Primary Service)
    { kw: "roof repair services", category: "roof_repair", tier: 1, weight: 15, label: "Roof Repair Services" },
    { kw: "roof repair contractor", category: "roof_repair", tier: 1, weight: 15, label: "Roof Repair Contractor" },
    { kw: "roof repair", category: "roof_repair", tier: 1, weight: 15, label: "Roof Repair" },
    { kw: "roof repairs", category: "roof_repair", tier: 1, weight: 15, label: "Roof Repair" },
    { kw: "roof leak repair", category: "roof_repair", tier: 1, weight: 15, label: "Roof Leak Repair" },
    { kw: "roof leak detection", category: "roof_repair", tier: 1, weight: 15, label: "Roof Leak Detection" },
    { kw: "residential roof repair", category: "roof_repair", tier: 1, weight: 15, label: "Residential Roof Repair" },
    { kw: "emergency roof repair", category: "emergency_roofing", tier: 1, weight: 15, label: "Emergency Roof Repair" },
    { kw: "emergency roof repairs", category: "emergency_roofing", tier: 1, weight: 15, label: "Emergency Roof Repair" },
    { kw: "storm damage roof repair", category: "emergency_roofing", tier: 1, weight: 15, label: "Storm Damage Roof Repair" },
    { kw: "storm damage roofing", category: "emergency_roofing", tier: 1, weight: 15, label: "Storm Damage Roofing" },

    // Roof Inspection (Dedicated Primary Service - Promoted to Tier 1)
    { kw: "roof inspection services", category: "roof_repair", tier: 1, weight: 15, label: "Roof Inspection Services" },
    { kw: "roof inspection", category: "roof_repair", tier: 1, weight: 15, label: "Roof Inspection" },
    { kw: "roof inspections", category: "roof_repair", tier: 1, weight: 15, label: "Roof Inspection" },
    { kw: "roof certification", category: "roof_repair", tier: 1, weight: 15, label: "Roof Certification" },

    // Shingle Roofing (Dedicated Primary Service - Promoted to Tier 1)
    { kw: "shingle roof replacement", category: "roofing_materials", tier: 1, weight: 15, label: "Shingle Roof Replacement" },
    { kw: "shingle roof repair", category: "roofing_materials", tier: 1, weight: 15, label: "Shingle Roof Repair" },
    { kw: "shingle roofing", category: "roofing_materials", tier: 1, weight: 15, label: "Shingle Roofing" },
    { kw: "shingle roof", category: "roofing_materials", tier: 1, weight: 15, label: "Shingle Roof" },
    { kw: "shingle roofs", category: "roofing_materials", tier: 1, weight: 15, label: "Shingle Roof" },
    { kw: "asphalt shingle roofing", category: "roofing_materials", tier: 1, weight: 15, label: "Asphalt Shingle Roofing" },
    { kw: "asphalt shingle roof", category: "roofing_materials", tier: 1, weight: 15, label: "Asphalt Shingle Roof" },
    { kw: "architectural shingles", category: "roofing_materials", tier: 1, weight: 15, label: "Architectural Shingles" },

    // Metal Roofing (Dedicated Primary Service - Promoted to Tier 1)
    { kw: "metal roof installation", category: "roofing_materials", tier: 1, weight: 15, label: "Metal Roof Installation" },
    { kw: "metal roof replacement", category: "roofing_materials", tier: 1, weight: 15, label: "Metal Roof Replacement" },
    { kw: "metal roof repair", category: "roofing_materials", tier: 1, weight: 15, label: "Metal Roof Repair" },
    { kw: "metal roofing", category: "roofing_materials", tier: 1, weight: 15, label: "Metal Roofing" },
    { kw: "metal roof", category: "roofing_materials", tier: 1, weight: 15, label: "Metal Roof" },
    { kw: "metal roofs", category: "roofing_materials", tier: 1, weight: 15, label: "Metal Roof" },
    { kw: "standing seam metal roof", category: "roofing_materials", tier: 1, weight: 15, label: "Standing Seam Metal Roof" },
    { kw: "standing seam roofing", category: "roofing_materials", tier: 1, weight: 15, label: "Standing Seam Roofing" },

    // Commercial & Flat Roofing (Dedicated Primary Service)
    { kw: "commercial roofing services", category: "commercial_roofing", tier: 1, weight: 15, label: "Commercial Roofing Services" },
    { kw: "commercial roofing contractor", category: "commercial_roofing", tier: 1, weight: 15, label: "Commercial Roofing Contractor" },
    { kw: "commercial roof replacement", category: "commercial_roofing", tier: 1, weight: 15, label: "Commercial Roof Replacement" },
    { kw: "commercial roof repair", category: "commercial_roofing", tier: 1, weight: 15, label: "Commercial Roof Repair" },
    { kw: "commercial roofing", category: "commercial_roofing", tier: 1, weight: 15, label: "Commercial Roofing" },
    { kw: "flat roof replacement", category: "commercial_roofing", tier: 1, weight: 15, label: "Flat Roof Replacement" },
    { kw: "flat roof installation", category: "commercial_roofing", tier: 1, weight: 15, label: "Flat Roof Installation" },
    { kw: "flat roof repair", category: "commercial_roofing", tier: 1, weight: 15, label: "Flat Roof Repair" },
    { kw: "flat roofing", category: "commercial_roofing", tier: 1, weight: 15, label: "Flat Roofing" },
    { kw: "flat roof", category: "commercial_roofing", tier: 1, weight: 15, label: "Flat Roof" },
    { kw: "flat roofs", category: "commercial_roofing", tier: 1, weight: 15, label: "Flat Roof" },
    { kw: "industrial roofing", category: "commercial_roofing", tier: 1, weight: 15, label: "Industrial Roofing" },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 2 — STRONG ROOFING SERVICE TERMS (weight = 10)
    // ════════════════════════════════════════════════════════════════════════
    { kw: "new roof", category: "roof_replacement", tier: 2, weight: 10, label: "New Roof" },
    { kw: "new roofs", category: "roof_replacement", tier: 2, weight: 10, label: "New Roof" },
    { kw: "roof maintenance", category: "roof_repair", tier: 2, weight: 10, label: "Roof Maintenance" },
    { kw: "roof tune-up", category: "roof_repair", tier: 2, weight: 10, label: "Roof Tune-Up" },
    { kw: "roof tune up", category: "roof_repair", tier: 2, weight: 10, label: "Roof Tune-Up" },
    { kw: "asphalt shingles", category: "roofing_materials", tier: 2, weight: 10, label: "Asphalt Shingles" },
    { kw: "asphalt shingle", category: "roofing_materials", tier: 2, weight: 10, label: "Asphalt Shingles" },
    { kw: "roof shingles", category: "roofing_materials", tier: 2, weight: 10, label: "Roof Shingles" },
    { kw: "tile roofing", category: "roofing_materials", tier: 2, weight: 10, label: "Tile Roofing" },
    { kw: "tile roof", category: "roofing_materials", tier: 2, weight: 10, label: "Tile Roofing" },
    { kw: "tile roofs", category: "roofing_materials", tier: 2, weight: 10, label: "Tile Roofing" },
    { kw: "tile roof repair", category: "roofing_materials", tier: 2, weight: 10, label: "Tile Roof Repair" },
    { kw: "slate roofing", category: "roofing_materials", tier: 2, weight: 10, label: "Slate Roofing" },
    { kw: "slate roof", category: "roofing_materials", tier: 2, weight: 10, label: "Slate Roofing" },
    { kw: "cedar shake roofing", category: "roofing_materials", tier: 2, weight: 10, label: "Cedar Shake Roofing" },
    { kw: "cedar roofing", category: "roofing_materials", tier: 2, weight: 10, label: "Cedar Roofing" },
    { kw: "cedar shake", category: "roofing_materials", tier: 2, weight: 10, label: "Cedar Shake" },
    { kw: "tpo roofing", category: "commercial_roofing", tier: 2, weight: 10, label: "TPO Roofing" },
    { kw: "epdm roofing", category: "commercial_roofing", tier: 2, weight: 10, label: "EPDM Roofing" },
    { kw: "pvc roofing", category: "commercial_roofing", tier: 2, weight: 10, label: "PVC Roofing" },
    { kw: "roof coating", category: "commercial_roofing", tier: 2, weight: 10, label: "Roof Coating" },
    { kw: "roof coatings", category: "commercial_roofing", tier: 2, weight: 10, label: "Roof Coating" },
    { kw: "modified bitumen", category: "commercial_roofing", tier: 2, weight: 10, label: "Modified Bitumen" },
    { kw: "built-up roofing", category: "commercial_roofing", tier: 2, weight: 10, label: "Built-Up Roofing" },
    { kw: "hail damage roof", category: "emergency_roofing", tier: 2, weight: 10, label: "Hail Damage Roofing" },
    { kw: "hail damage roofing", category: "emergency_roofing", tier: 2, weight: 10, label: "Hail Damage Roofing" },
    { kw: "wind damage roof", category: "emergency_roofing", tier: 2, weight: 10, label: "Wind Damage Roofing" },
    { kw: "roof replacement cost", category: "roof_replacement", tier: 2, weight: 10, label: "Roof Replacement Cost" },
    { kw: "free roof estimate", category: "roof_replacement", tier: 2, weight: 10, label: "Free Roof Estimate" },
    { kw: "free roofing estimate", category: "roof_replacement", tier: 2, weight: 10, label: "Free Roofing Estimate" },
    { kw: "roofing and gutters", category: "roof_installation", tier: 2, weight: 10, label: "Roofing & Gutters" },
    { kw: "roofing & gutters", category: "roof_installation", tier: 2, weight: 10, label: "Roofing & Gutters" },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 3 — SUPPORTING ROOFING TERMINOLOGY (weight = 4)
    // ════════════════════════════════════════════════════════════════════════
    { kw: "roofer", category: "roof_replacement", tier: 3, weight: 4, label: "Roofer" },
    { kw: "roofers", category: "roof_replacement", tier: 3, weight: 4, label: "Roofer" },
    { kw: "roof leaks", category: "roof_repair", tier: 3, weight: 4, label: "Roof Leaks" },
    { kw: "roof leak", category: "roof_repair", tier: 3, weight: 4, label: "Roof Leak" },
    { kw: "flashing repair", category: "roof_repair", tier: 3, weight: 4, label: "Flashing Repair" },
    { kw: "roof flashing", category: "roof_repair", tier: 3, weight: 4, label: "Roof Flashing" },
    { kw: "roof decking", category: "roof_installation", tier: 3, weight: 4, label: "Roof Decking" },
    { kw: "roof underlayment", category: "roofing_materials", tier: 3, weight: 4, label: "Roof Underlayment" },
    { kw: "underlayment", category: "roofing_materials", tier: 3, weight: 3, label: "Underlayment" },
    { kw: "ice dam", category: "emergency_roofing", tier: 3, weight: 4, label: "Ice Dam" },
    { kw: "ice dams", category: "emergency_roofing", tier: 3, weight: 4, label: "Ice Dams" },
    { kw: "insurance claim roofing", category: "emergency_roofing", tier: 3, weight: 4, label: "Insurance Claim Roofing" },
    { kw: "storm restoration", category: "emergency_roofing", tier: 3, weight: 4, label: "Storm Restoration" },

    // ════════════════════════════════════════════════════════════════════════
    // TIER 4 — CONTEXTUAL / ANCILLARY SIGNALS (weight = 1-2)
    // Ancillary terms and standalone words cannot validate a roofing business alone
    // ════════════════════════════════════════════════════════════════════════
    { kw: "roofing", category: "roof_replacement", tier: 4, weight: 2, label: "Roofing" },
    { kw: "roofs", category: "roof_replacement", tier: 4, weight: 1, label: "Roofs" },
    { kw: "roof", category: "roof_replacement", tier: 4, weight: 1, label: "Roof" },
    { kw: "shingles", category: "roofing_materials", tier: 4, weight: 2, label: "Shingles" },
    { kw: "shingle", category: "roofing_materials", tier: 4, weight: 2, label: "Shingle" },
    { kw: "gutter installation", category: "roof_installation", tier: 4, weight: 2, label: "Gutter Installation" },
    { kw: "gutter replacement", category: "roof_installation", tier: 4, weight: 2, label: "Gutter Replacement" },
    { kw: "gutter repair", category: "roof_installation", tier: 4, weight: 2, label: "Gutter Repair" },
    { kw: "gutters", category: "roof_installation", tier: 4, weight: 2, label: "Gutters" },
    { kw: "skylight installation", category: "roof_installation", tier: 4, weight: 2, label: "Skylight Installation" },
    { kw: "skylights", category: "roof_installation", tier: 4, weight: 2, label: "Skylights" },
    { kw: "attic ventilation", category: "roof_installation", tier: 4, weight: 2, label: "Attic Ventilation" },
  ];

  // ── ROOFING NEGATIVE KEYWORDS (PENALTY = −10 pts each) ──────────────────
  // Distinguishes non-roofing trades, incidental cleaners, solar, and retailers
  const ROOFING_NEGATIVE_KEYWORDS = [
    // Non-roofing primary contractor trades
    "hvac contractor",
    "hvac company",
    "air conditioning contractor",
    "heating and cooling",
    "plumbing contractor",
    "plumbing service",
    "electrician",
    "electrical contractor",
    "patio installation",
    "hardscape contractor",
    "lawn mowing",
    "lawn care service",
    "landscaping company",
    "pest control",
    "exterminator",
    // Power / Pressure washing (cleaning only, not contractor repair/replacement)
    "pressure washing",
    "power washing",
    "soft washing",
    "roof cleaning service",
    "roof wash",
    "roof soft wash",
    "pressure washing service",
    // Solar installers (solar mounted on roof, not a roofing company)
    "solar panel installation",
    "solar panel installer",
    "solar panels",
    "solar contractor",
    "solar energy company",
    "solar power system",
    // Window / Siding only companies
    "window replacement company",
    "replacement windows",
    "window contractor",
    "vinyl siding contractor",
    "siding replacement",
    // Home inspection / Chimney / Gutter-only
    "home inspector",
    "home inspection",
    "certified home inspector",
    "property inspection",
    "chimney sweep",
    "chimney cleaning",
    "gutter cleaning service",
    "gutter clean out",
    // Flooring / Interior / Auto
    "flooring contractor",
    "hardwood flooring",
    "carpet cleaning",
    "interior painting",
    "auto body shop",
    "car repair",
    // Roofing materials retail/wholesale only (not a contractor)
    "roofing supply store",
    "roofing supplies",
    "roofing manufacturer",
    "roofing distributor",
    "wholesale roofing",
    "roofing products",
    "roofing materials store",
    "roofing supplier",
  ];

  // ════════════════════════════════════════════════════════════════════════
  // SECTION B3: MOVING COMPANY KEYWORD LEXICON
  //
  // Tier 1 (weight=15): Core moving company identity & dedicated service terms — highest signal
  // Tier 2 (weight=10): Strong moving service terms — major signal
  // Tier 3 (weight=5):  Supporting moving terminology — moderate signal
  // Tier 4 (weight=2):  Contextual words — minimal signal (require many to matter)
  // ════════════════════════════════════════════════════════════════════════

  const MOVING_KEYWORDS = [
    // ╔════════════════════════════════════════════════════════════════════
    // TIER 1 — CORE MOVING COMPANY IDENTITY & DEDICATED PRIMARY SERVICES (weight=15)
    // ╚════════════════════════════════════════════════════════════════════

    // ── Company Identity (core identity phrases — unambiguous) ──
    { kw: "moving company",            category: "moving_company", tier: 1, weight: 15, label: "Moving Company" },
    { kw: "moving companies",          category: "moving_company", tier: 1, weight: 15, label: "Moving Company" },
    { kw: "moving service",            category: "moving_company", tier: 1, weight: 15, label: "Moving Service" },
    { kw: "moving services",           category: "moving_company", tier: 1, weight: 15, label: "Moving Services" },
    { kw: "professional movers",       category: "moving_company", tier: 1, weight: 15, label: "Professional Movers" },
    { kw: "professional mover",        category: "moving_company", tier: 1, weight: 15, label: "Professional Mover" },
    { kw: "professional moving",       category: "moving_company", tier: 1, weight: 15, label: "Professional Moving" },
    { kw: "professional moving company", category: "moving_company", tier: 1, weight: 15, label: "Professional Moving Company" },
    { kw: "relocation company",        category: "moving_company", tier: 1, weight: 15, label: "Relocation Company" },
    { kw: "relocation companies",      category: "moving_company", tier: 1, weight: 15, label: "Relocation Company" },
    { kw: "relocation services",       category: "moving_company", tier: 1, weight: 15, label: "Relocation Services" },
    { kw: "relocation service",        category: "moving_company", tier: 1, weight: 15, label: "Relocation Service" },
    { kw: "relocation specialist",     category: "moving_company", tier: 1, weight: 15, label: "Relocation Specialist" },
    { kw: "relocation specialists",    category: "moving_company", tier: 1, weight: 15, label: "Relocation Specialist" },
    { kw: "relocation experts",        category: "moving_company", tier: 1, weight: 15, label: "Relocation Experts" },
    { kw: "relocation expert",         category: "moving_company", tier: 1, weight: 15, label: "Relocation Experts" },
    { kw: "relocation management",     category: "moving_company", tier: 1, weight: 15, label: "Relocation Management" },
    { kw: "moving crew",               category: "moving_company", tier: 1, weight: 15, label: "Moving Crew" },
    { kw: "moving team",               category: "moving_company", tier: 1, weight: 15, label: "Moving Team" },
    { kw: "moving experts",            category: "moving_company", tier: 1, weight: 15, label: "Moving Experts" },
    { kw: "moving expert",             category: "moving_company", tier: 1, weight: 15, label: "Moving Experts" },
    { kw: "moving specialists",        category: "moving_company", tier: 1, weight: 15, label: "Moving Specialists" },
    { kw: "moving specialist",         category: "moving_company", tier: 1, weight: 15, label: "Moving Specialist" },
    { kw: "moving contractor",         category: "moving_company", tier: 1, weight: 15, label: "Moving Contractor" },
    { kw: "licensed movers",           category: "moving_company", tier: 1, weight: 15, label: "Licensed Movers" },
    { kw: "insured movers",            category: "moving_company", tier: 1, weight: 15, label: "Insured Movers" },
    { kw: "bonded movers",             category: "moving_company", tier: 1, weight: 15, label: "Bonded Movers" },
    { kw: "full service movers",       category: "moving_company", tier: 1, weight: 15, label: "Full Service Movers" },
    { kw: "full-service movers",       category: "moving_company", tier: 1, weight: 15, label: "Full Service Movers" },
    { kw: "full service moving",       category: "moving_company", tier: 1, weight: 15, label: "Full Service Moving" },
    { kw: "full-service moving",       category: "moving_company", tier: 1, weight: 15, label: "Full Service Moving" },
    // Packers and Movers (common Indian/international terminology)
    { kw: "packers and movers",        category: "moving_company", tier: 1, weight: 15, label: "Packers and Movers" },
    { kw: "packers & movers",          category: "moving_company", tier: 1, weight: 15, label: "Packers and Movers" },
    { kw: "packer and mover",          category: "moving_company", tier: 1, weight: 15, label: "Packers and Movers" },
    { kw: "household shifting",        category: "moving_company", tier: 1, weight: 15, label: "Household Shifting" },
    { kw: "house shifting",            category: "moving_company", tier: 1, weight: 15, label: "House Shifting" },
    { kw: "home shifting",             category: "moving_company", tier: 1, weight: 15, label: "Home Shifting" },
    { kw: "domestic shifting",         category: "moving_company", tier: 1, weight: 15, label: "Domestic Shifting" },

    // ── Residential Moving (dedicated service) ──
    { kw: "residential moving company",  category: "residential", tier: 1, weight: 15, label: "Residential Moving Company" },
    { kw: "residential moving services", category: "residential", tier: 1, weight: 15, label: "Residential Moving Services" },
    { kw: "residential moving service",  category: "residential", tier: 1, weight: 15, label: "Residential Moving Services" },
    { kw: "residential moving",          category: "residential", tier: 1, weight: 15, label: "Residential Moving" },
    { kw: "residential movers",          category: "residential", tier: 1, weight: 15, label: "Residential Movers" },
    { kw: "residential mover",           category: "residential", tier: 1, weight: 15, label: "Residential Movers" },
    { kw: "home movers",                 category: "residential", tier: 1, weight: 15, label: "Home Movers" },
    { kw: "home mover",                  category: "residential", tier: 1, weight: 15, label: "Home Movers" },
    { kw: "house movers",                category: "residential", tier: 1, weight: 15, label: "House Movers" },
    { kw: "house mover",                 category: "residential", tier: 1, weight: 15, label: "House Movers" },
    { kw: "house moving",                category: "residential", tier: 1, weight: 15, label: "House Moving" },
    { kw: "house moving services",       category: "residential", tier: 1, weight: 15, label: "House Moving Services" },
    { kw: "home moving",                 category: "residential", tier: 1, weight: 15, label: "Home Moving" },
    { kw: "home moving services",        category: "residential", tier: 1, weight: 15, label: "Home Moving Services" },
    { kw: "household moving",            category: "residential", tier: 1, weight: 15, label: "Household Moving" },
    { kw: "household movers",            category: "residential", tier: 1, weight: 15, label: "Household Movers" },
    { kw: "apartment movers",            category: "residential", tier: 1, weight: 15, label: "Apartment Movers" },
    { kw: "apartment moving",            category: "residential", tier: 1, weight: 15, label: "Apartment Moving" },
    { kw: "condo movers",                category: "residential", tier: 1, weight: 15, label: "Condo Movers" },
    { kw: "home relocation",             category: "residential", tier: 1, weight: 15, label: "Home Relocation" },
    { kw: "household relocation",        category: "residential", tier: 1, weight: 15, label: "Household Relocation" },
    { kw: "household goods transportation", category: "residential", tier: 1, weight: 15, label: "Household Goods Transportation" },
    { kw: "household goods",             category: "residential", tier: 1, weight: 15, label: "Household Goods" },

    // ── Local Movers (dedicated service) ──
    { kw: "local moving company",        category: "residential", tier: 1, weight: 15, label: "Local Moving Company" },
    { kw: "local movers",                category: "residential", tier: 1, weight: 15, label: "Local Movers" },
    { kw: "local mover",                 category: "residential", tier: 1, weight: 15, label: "Local Movers" },
    { kw: "local moving",                category: "residential", tier: 1, weight: 15, label: "Local Moving" },
    { kw: "local moving services",       category: "residential", tier: 1, weight: 15, label: "Local Moving Services" },

    // ── Commercial Moving (dedicated service) ──
    { kw: "commercial moving company",   category: "commercial", tier: 1, weight: 15, label: "Commercial Moving Company" },
    { kw: "commercial moving services",  category: "commercial", tier: 1, weight: 15, label: "Commercial Moving Services" },
    { kw: "commercial moving service",   category: "commercial", tier: 1, weight: 15, label: "Commercial Moving Services" },
    { kw: "commercial moving",           category: "commercial", tier: 1, weight: 15, label: "Commercial Moving" },
    { kw: "commercial movers",           category: "commercial", tier: 1, weight: 15, label: "Commercial Movers" },
    { kw: "commercial mover",            category: "commercial", tier: 1, weight: 15, label: "Commercial Movers" },
    { kw: "office moving",               category: "commercial", tier: 1, weight: 15, label: "Office Moving" },
    { kw: "office movers",               category: "commercial", tier: 1, weight: 15, label: "Office Movers" },
    { kw: "office mover",                category: "commercial", tier: 1, weight: 15, label: "Office Movers" },
    { kw: "office moving services",      category: "commercial", tier: 1, weight: 15, label: "Office Moving Services" },
    { kw: "office relocation",           category: "commercial", tier: 1, weight: 15, label: "Office Relocation" },
    { kw: "office relocation services",  category: "commercial", tier: 1, weight: 15, label: "Office Relocation Services" },
    { kw: "business relocation",         category: "commercial", tier: 1, weight: 15, label: "Business Relocation" },
    { kw: "corporate relocation",        category: "commercial", tier: 1, weight: 15, label: "Corporate Relocation" },
    { kw: "corporate moving",            category: "commercial", tier: 1, weight: 15, label: "Corporate Moving" },
    { kw: "corporate movers",            category: "commercial", tier: 1, weight: 15, label: "Corporate Movers" },
    { kw: "warehouse moving",            category: "commercial", tier: 1, weight: 15, label: "Warehouse Moving" },
    { kw: "warehouse relocation",        category: "commercial", tier: 1, weight: 15, label: "Warehouse Relocation" },
    { kw: "industrial moving",           category: "commercial", tier: 1, weight: 15, label: "Industrial Moving" },

    // ── Long Distance Moving (dedicated service) ──
    { kw: "long distance moving company",  category: "long_distance", tier: 1, weight: 15, label: "Long Distance Moving Company" },
    { kw: "long distance moving services", category: "long_distance", tier: 1, weight: 15, label: "Long Distance Moving Services" },
    { kw: "long distance moving",          category: "long_distance", tier: 1, weight: 15, label: "Long Distance Moving" },
    { kw: "long-distance moving",          category: "long_distance", tier: 1, weight: 15, label: "Long Distance Moving" },
    { kw: "long distance movers",          category: "long_distance", tier: 1, weight: 15, label: "Long Distance Movers" },
    { kw: "long-distance movers",          category: "long_distance", tier: 1, weight: 15, label: "Long Distance Movers" },
    { kw: "long distance mover",           category: "long_distance", tier: 1, weight: 15, label: "Long Distance Movers" },
    { kw: "interstate movers",             category: "long_distance", tier: 1, weight: 15, label: "Interstate Movers" },
    { kw: "interstate mover",              category: "long_distance", tier: 1, weight: 15, label: "Interstate Movers" },
    { kw: "interstate moving",             category: "long_distance", tier: 1, weight: 15, label: "Interstate Moving" },
    { kw: "interstate moving services",    category: "long_distance", tier: 1, weight: 15, label: "Interstate Moving Services" },
    { kw: "cross country moving",          category: "long_distance", tier: 1, weight: 15, label: "Cross Country Moving" },
    { kw: "cross-country movers",          category: "long_distance", tier: 1, weight: 15, label: "Cross Country Movers" },
    { kw: "cross country movers",          category: "long_distance", tier: 1, weight: 15, label: "Cross Country Movers" },
    { kw: "state to state movers",         category: "long_distance", tier: 1, weight: 15, label: "State to State Movers" },
    { kw: "state-to-state movers",         category: "long_distance", tier: 1, weight: 15, label: "State to State Movers" },
    { kw: "nationwide moving",             category: "long_distance", tier: 1, weight: 15, label: "Nationwide Moving" },
    { kw: "nationwide movers",             category: "long_distance", tier: 1, weight: 15, label: "Nationwide Movers" },
    { kw: "international moving",          category: "long_distance", tier: 1, weight: 15, label: "International Moving" },
    { kw: "international movers",          category: "long_distance", tier: 1, weight: 15, label: "International Movers" },
    { kw: "international relocation",      category: "long_distance", tier: 1, weight: 15, label: "International Relocation" },
    { kw: "international move",            category: "long_distance", tier: 1, weight: 15, label: "International Move" },
    { kw: "overseas moving",               category: "long_distance", tier: 1, weight: 15, label: "Overseas Moving" },
    { kw: "overseas relocation",           category: "long_distance", tier: 1, weight: 15, label: "Overseas Relocation" },

    // ── Packing Services (dedicated primary service) ──
    { kw: "packing and moving",            category: "packing", tier: 1, weight: 15, label: "Packing and Moving" },
    { kw: "packing & moving",              category: "packing", tier: 1, weight: 15, label: "Packing & Moving" },
    { kw: "packing and moving services",   category: "packing", tier: 1, weight: 15, label: "Packing and Moving Services" },
    { kw: "packing and unpacking",         category: "packing", tier: 1, weight: 15, label: "Packing and Unpacking" },
    { kw: "packing and unpacking services",category: "packing", tier: 1, weight: 15, label: "Packing and Unpacking" },
    { kw: "professional packing",          category: "packing", tier: 1, weight: 15, label: "Professional Packing" },
    { kw: "professional packing services", category: "packing", tier: 1, weight: 15, label: "Professional Packing" },
    { kw: "full packing services",         category: "packing", tier: 1, weight: 15, label: "Full Packing Services" },
    { kw: "furniture packing",             category: "packing", tier: 1, weight: 15, label: "Furniture Packing" },
    { kw: "furniture disassembly",         category: "packing", tier: 1, weight: 15, label: "Furniture Disassembly" },
    { kw: "furniture assembly",            category: "packing", tier: 1, weight: 15, label: "Furniture Assembly" },
    { kw: "disassembly and reassembly",    category: "packing", tier: 1, weight: 15, label: "Disassembly and Reassembly" },

    // ── Moving & Storage (dedicated service) ──
    { kw: "moving and storage",            category: "moving_storage", tier: 1, weight: 15, label: "Moving and Storage" },
    { kw: "moving & storage",              category: "moving_storage", tier: 1, weight: 15, label: "Moving & Storage" },
    { kw: "moving storage",                category: "moving_storage", tier: 1, weight: 15, label: "Moving Storage" },
    { kw: "moving and storage company",    category: "moving_storage", tier: 1, weight: 15, label: "Moving and Storage Company" },
    { kw: "moving and storage services",   category: "moving_storage", tier: 1, weight: 15, label: "Moving and Storage Services" },

    // ╔════════════════════════════════════════════════════════════════════
    // TIER 2 — STRONG MOVING SERVICE TERMS (weight=10)
    // ╚════════════════════════════════════════════════════════════════════

    { kw: "movers",                        category: "moving_company", tier: 2, weight: 10, label: "Movers" },
    { kw: "mover",                         category: "moving_company", tier: 2, weight: 10, label: "Mover" },
    { kw: "moving quote",                  category: "moving_company", tier: 2, weight: 10, label: "Moving Quote" },
    { kw: "moving estimate",               category: "moving_company", tier: 2, weight: 10, label: "Moving Estimate" },
    { kw: "moving estimates",              category: "moving_company", tier: 2, weight: 10, label: "Moving Estimate" },
    { kw: "free moving quote",             category: "moving_company", tier: 2, weight: 10, label: "Free Moving Quote" },
    { kw: "free moving estimate",          category: "moving_company", tier: 2, weight: 10, label: "Free Moving Estimate" },
    { kw: "moving cost",                   category: "moving_company", tier: 2, weight: 10, label: "Moving Cost" },
    { kw: "moving rates",                  category: "moving_company", tier: 2, weight: 10, label: "Moving Rates" },
    { kw: "moving price",                  category: "moving_company", tier: 2, weight: 10, label: "Moving Price" },
    { kw: "book your move",                category: "moving_company", tier: 2, weight: 10, label: "Book Your Move" },
    { kw: "schedule your move",            category: "moving_company", tier: 2, weight: 10, label: "Schedule Your Move" },
    { kw: "start your move",               category: "moving_company", tier: 2, weight: 10, label: "Start Your Move" },
    { kw: "get a moving quote",            category: "moving_company", tier: 2, weight: 10, label: "Get a Moving Quote" },
    { kw: "request a moving estimate",     category: "moving_company", tier: 2, weight: 10, label: "Request a Moving Estimate" },
    { kw: "hire movers",                   category: "moving_company", tier: 2, weight: 10, label: "Hire Movers" },
    { kw: "book movers",                   category: "moving_company", tier: 2, weight: 10, label: "Book Movers" },
    { kw: "hire a mover",                  category: "moving_company", tier: 2, weight: 10, label: "Hire a Mover" },
    { kw: "moving logistics",              category: "moving_company", tier: 2, weight: 10, label: "Moving Logistics" },
    { kw: "relocation logistics",          category: "moving_company", tier: 2, weight: 10, label: "Relocation Logistics" },
    { kw: "domestic moving",               category: "residential",    tier: 2, weight: 10, label: "Domestic Moving" },
    { kw: "domestic movers",               category: "residential",    tier: 2, weight: 10, label: "Domestic Movers" },
    { kw: "family movers",                 category: "residential",    tier: 2, weight: 10, label: "Family Movers" },
    { kw: "senior moving",                 category: "residential",    tier: 2, weight: 10, label: "Senior Moving" },
    { kw: "senior movers",                 category: "residential",    tier: 2, weight: 10, label: "Senior Movers" },
    { kw: "student moving",                category: "residential",    tier: 2, weight: 10, label: "Student Moving" },
    { kw: "military moving",               category: "residential",    tier: 2, weight: 10, label: "Military Moving" },
    { kw: "military relocation",           category: "residential",    tier: 2, weight: 10, label: "Military Relocation" },
    { kw: "furniture movers",              category: "residential",    tier: 2, weight: 10, label: "Furniture Movers" },
    { kw: "furniture moving",              category: "residential",    tier: 2, weight: 10, label: "Furniture Moving" },
    { kw: "furniture moving services",     category: "residential",    tier: 2, weight: 10, label: "Furniture Moving Services" },
    { kw: "piano movers",                  category: "residential",    tier: 2, weight: 10, label: "Piano Movers" },
    { kw: "piano moving",                  category: "residential",    tier: 2, weight: 10, label: "Piano Moving" },
    { kw: "antique moving",                category: "residential",    tier: 2, weight: 10, label: "Antique Moving" },
    { kw: "specialty moving",              category: "residential",    tier: 2, weight: 10, label: "Specialty Moving" },
    { kw: "fragile item moving",           category: "residential",    tier: 2, weight: 10, label: "Fragile Item Moving" },
    { kw: "appliance moving",              category: "residential",    tier: 2, weight: 10, label: "Appliance Moving" },
    { kw: "vehicle moving",                category: "residential",    tier: 2, weight: 10, label: "Vehicle Moving" },
    { kw: "car moving",                    category: "residential",    tier: 2, weight: 10, label: "Car Moving" },
    { kw: "car shipping",                  category: "residential",    tier: 2, weight: 10, label: "Car Shipping" },
    { kw: "auto transport",                category: "residential",    tier: 2, weight: 10, label: "Auto Transport" },
    { kw: "loading and unloading",         category: "residential",    tier: 2, weight: 10, label: "Loading and Unloading" },
    { kw: "loading & unloading",           category: "residential",    tier: 2, weight: 10, label: "Loading & Unloading" },
    { kw: "loading crew",                  category: "residential",    tier: 2, weight: 10, label: "Loading Crew" },
    { kw: "unloading crew",                category: "residential",    tier: 2, weight: 10, label: "Unloading Crew" },
    { kw: "moving truck",                  category: "residential",    tier: 2, weight: 10, label: "Moving Truck" },
    { kw: "moving trucks",                 category: "residential",    tier: 2, weight: 10, label: "Moving Truck" },
    { kw: "moving van",                    category: "residential",    tier: 2, weight: 10, label: "Moving Van" },
    { kw: "moving vans",                   category: "residential",    tier: 2, weight: 10, label: "Moving Van" },
    { kw: "packing service",               category: "packing",        tier: 2, weight: 10, label: "Packing Service" },
    { kw: "packing services",              category: "packing",        tier: 2, weight: 10, label: "Packing Services" },
    { kw: "unpacking services",            category: "packing",        tier: 2, weight: 10, label: "Unpacking Services" },
    { kw: "unpacking service",             category: "packing",        tier: 2, weight: 10, label: "Unpacking Services" },
    { kw: "moving boxes",                  category: "packing",        tier: 2, weight: 10, label: "Moving Boxes" },
    { kw: "moving supplies",               category: "packing",        tier: 2, weight: 10, label: "Moving Supplies" },
    { kw: "household packing",             category: "packing",        tier: 2, weight: 10, label: "Household Packing" },
    { kw: "temporary storage",             category: "moving_storage", tier: 2, weight: 10, label: "Temporary Storage" },
    { kw: "storage solutions",             category: "moving_storage", tier: 2, weight: 10, label: "Storage Solutions" },
    { kw: "household storage",             category: "moving_storage", tier: 2, weight: 10, label: "Household Storage" },
    { kw: "storage facility",              category: "moving_storage", tier: 2, weight: 10, label: "Storage Facility" },
    { kw: "secure storage",                category: "moving_storage", tier: 2, weight: 10, label: "Secure Storage" },
    { kw: "safe moving",                   category: "residential",    tier: 2, weight: 10, label: "Safe Moving" },

    // ╔════════════════════════════════════════════════════════════════════
    // TIER 3 — SUPPORTING MOVING TERMINOLOGY (weight=5)
    // ╚════════════════════════════════════════════════════════════════════

    { kw: "moving day",                    category: "moving_company", tier: 3, weight: 5, label: "Moving Day" },
    { kw: "moving checklist",              category: "moving_company", tier: 3, weight: 5, label: "Moving Checklist" },
    { kw: "move coordinator",              category: "moving_company", tier: 3, weight: 5, label: "Move Coordinator" },
    { kw: "move management",               category: "moving_company", tier: 3, weight: 5, label: "Move Management" },
    { kw: "moving professionals",          category: "moving_company", tier: 3, weight: 5, label: "Moving Professionals" },
    { kw: "experienced movers",            category: "moving_company", tier: 3, weight: 5, label: "Experienced Movers" },
    { kw: "trusted movers",                category: "moving_company", tier: 3, weight: 5, label: "Trusted Movers" },
    { kw: "affordable movers",             category: "moving_company", tier: 3, weight: 5, label: "Affordable Movers" },
    { kw: "affordable moving",             category: "moving_company", tier: 3, weight: 5, label: "Affordable Moving" },
    { kw: "reliable movers",               category: "moving_company", tier: 3, weight: 5, label: "Reliable Movers" },
    { kw: "reliable moving",               category: "moving_company", tier: 3, weight: 5, label: "Reliable Moving" },
    { kw: "same day movers",               category: "moving_company", tier: 3, weight: 5, label: "Same Day Movers" },
    { kw: "same day moving",               category: "moving_company", tier: 3, weight: 5, label: "Same Day Moving" },
    { kw: "next day movers",               category: "moving_company", tier: 3, weight: 5, label: "Next Day Movers" },
    { kw: "last minute movers",            category: "moving_company", tier: 3, weight: 5, label: "Last Minute Movers" },
    { kw: "residential relocation",        category: "residential",    tier: 3, weight: 5, label: "Residential Relocation" },
    { kw: "home to home",                  category: "residential",    tier: 3, weight: 5, label: "Home to Home" },
    { kw: "door to door moving",           category: "residential",    tier: 3, weight: 5, label: "Door to Door Moving" },
    { kw: "door-to-door moving",           category: "residential",    tier: 3, weight: 5, label: "Door to Door Moving" },
    { kw: "heavy lifting",                 category: "residential",    tier: 3, weight: 5, label: "Heavy Lifting" },
    { kw: "furniture wrapping",            category: "packing",        tier: 3, weight: 5, label: "Furniture Wrapping" },
    { kw: "item protection",               category: "packing",        tier: 3, weight: 5, label: "Item Protection" },
    { kw: "bubble wrap",                   category: "packing",        tier: 3, weight: 5, label: "Bubble Wrap" },
    { kw: "packing materials",             category: "packing",        tier: 3, weight: 5, label: "Packing Materials" },
    { kw: "moving protection",             category: "packing",        tier: 3, weight: 5, label: "Moving Protection" },
    { kw: "climate controlled storage",    category: "moving_storage", tier: 3, weight: 5, label: "Climate Controlled Storage" },
    { kw: "short term storage",            category: "moving_storage", tier: 3, weight: 5, label: "Short Term Storage" },
    { kw: "long term storage",             category: "moving_storage", tier: 3, weight: 5, label: "Long Term Storage" },
    { kw: "interstate move",               category: "long_distance",  tier: 3, weight: 5, label: "Interstate Move" },
    { kw: "out of state move",             category: "long_distance",  tier: 3, weight: 5, label: "Out of State Move" },
    { kw: "out-of-state move",             category: "long_distance",  tier: 3, weight: 5, label: "Out of State Move" },
    { kw: "out of state moving",           category: "long_distance",  tier: 3, weight: 5, label: "Out of State Moving" },

    // ╔════════════════════════════════════════════════════════════════════
    // TIER 4 — CONTEXTUAL WORDS (weight=2, require many matches with strong tier signals)
    // These words CANNOT trigger a moving classification on their own.
    // ╚════════════════════════════════════════════════════════════════════
    // NOTE: "moving" alone is NOT in tier 4 intentionally — the word appears on
    // countless non-moving business websites and must never contribute score on its own.
  ];

  // ── MOVING NEGATIVE KEYWORDS (PENALTY = −10 pts each) ──────────────────
  // Suppresses false positives: businesses that use moving/relocation language
  // but are NOT actual moving companies.
  const MOVING_NEGATIVE_KEYWORDS = [
    // Real estate (heavy usage of "moving" but not a mover)
    "real estate agent",
    "real estate company",
    "realtor",
    "realtors",
    "real estate broker",
    "sell your home",
    "buy a home",
    "home listing",
    "property listing",
    "mortgage",
    "mortgage broker",
    "mortgage lender",
    "home loan",
    "real estate investment",
    "real estate investor",
    // Insurance
    "insurance company",
    "insurance agent",
    "life insurance",
    "renters insurance",
    "homeowners insurance",
    // Truck rental only (not a mover service)
    "truck rental",
    "van rental",
    "vehicle rental",
    "rent a truck",
    "rent a van",
    "truck rentals",
    // Logistics & freight (not household movers)
    "freight forwarding",
    "freight forwarder",
    "cargo transportation",
    "cargo shipping",
    "freight company",
    "logistics company",
    "logistics provider",
    "logistics solutions",
    "supply chain",
    "trucking company",
    "trucking services",
    "courier service",
    "courier company",
    "parcel delivery",
    "package delivery",
    "shipping company",
    "freight broker",
    // Storage only (without moving context)
    "self storage",
    "self-storage",
    "storage unit",
    "storage units",
    "mini storage",
    "rv storage",
    "boat storage",
    "public storage",
    // Construction trades
    "roofing company",
    "roofing contractor",
    "hvac company",
    "hvac contractor",
    "construction company",
    "remodeling company",
    "landscaping company",
    "hardscape contractor",
    "excavation contractor",
    "demolition company",
    // Junk / Cleanout
    "junk removal",
    "junk hauling",
    "trash removal",
    "debris removal",
    // Cleaning
    "cleaning service",
    "cleaning company",
    "house cleaning",
    // Motivational / Marketing / Technology (false use of "moving forward")
    "moving your business forward",
    "moving forward together",
    "marketing agency",
    "digital marketing",
    "consulting firm",
    "software company",
    "tech company",
    // Furniture retail / Interior design
    "furniture store",
    "furniture manufacturer",
    "interior design",
    "interior designer",
    // Moving review / news / blog sites (not service providers)
    "moving company reviews",
    "moving company ratings",
    "best moving companies",
    "movers reviews",
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION C: BUILD KEYWORD MAPS
  // ══════════════════════════════════════════════════════════════════════════

  // ── Hardscape Maps ──
  const KEYWORD_MAP = new Map();
  const sortedHardscapeKws = [...HARDSCAPE_KEYWORDS].sort(
    (a, b) => b.kw.length - a.kw.length,
  );
  for (const entry of sortedHardscapeKws) {
    KEYWORD_MAP.set(entry.kw.toLowerCase(), {
      category: entry.category,
      tier: entry.tier,
      weight: entry.weight,
      label: entry.label,
    });
  }

  const NEGATIVE_MAP = new Map();
  const sortedHardscapeNeg = [...HARDSCAPE_NEGATIVE_KEYWORDS].sort(
    (a, b) => b.length - a.length,
  );
  for (const kw of sortedHardscapeNeg) {
    NEGATIVE_MAP.set(kw.toLowerCase(), -10);
  }

  const SECONDARY_MAP = new Map();
  const sortedSecondary = [...SECONDARY_KEYWORDS].sort(
    (a, b) => b.kw.length - a.kw.length,
  );
  for (const entry of sortedSecondary) {
    SECONDARY_MAP.set(entry.kw.toLowerCase(), entry.label);
  }

  // ── HVAC Maps ──
  const HVAC_KEYWORD_MAP = new Map();
  const sortedHvacKws = [...HVAC_KEYWORDS].sort(
    (a, b) => b.kw.length - a.kw.length,
  );
  for (const entry of sortedHvacKws) {
    HVAC_KEYWORD_MAP.set(entry.kw.toLowerCase(), {
      category: entry.category,
      tier: entry.tier,
      weight: entry.weight,
      label: entry.label,
    });
  }

  const HVAC_NEGATIVE_MAP = new Map();
  const sortedHvacNeg = [...HVAC_NEGATIVE_KEYWORDS].sort(
    (a, b) => b.length - a.length,
  );
  for (const kw of sortedHvacNeg) {
    HVAC_NEGATIVE_MAP.set(kw.toLowerCase(), -10);
  }

  // ── Roofing Maps & Precompiled Word-Boundary Regexes ──
  const ROOFING_KEYWORD_MAP = new Map();
  const ROOFING_KEYWORD_REGEXES = [];
  const sortedRoofingKws = [...ROOFING_KEYWORDS].sort(
    (a, b) => b.kw.length - a.kw.length,
  );
  for (const entry of sortedRoofingKws) {
    const lowerKw = entry.kw.toLowerCase();
    const info = {
      category: entry.category,
      tier: entry.tier,
      weight: entry.weight,
      label: entry.label,
    };
    ROOFING_KEYWORD_MAP.set(lowerKw, info);
    const escaped = lowerKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    ROOFING_KEYWORD_REGEXES.push({
      kw: lowerKw,
      info,
      regex: new RegExp(`\\b${escaped}\\b`, "gi"),
    });
  }

  const ROOFING_NEGATIVE_MAP = new Map();
  const sortedRoofingNeg = [...ROOFING_NEGATIVE_KEYWORDS].sort(
    (a, b) => b.length - a.length,
  );
  for (const kw of sortedRoofingNeg) {
    ROOFING_NEGATIVE_MAP.set(kw.toLowerCase(), -10);
  }

  // ── Moving Maps & Precompiled Word-Boundary Regexes ──
  const MOVING_KEYWORD_MAP = new Map();
  const MOVING_KEYWORD_REGEXES = [];
  const sortedMovingKws = [...MOVING_KEYWORDS].sort(
    (a, b) => b.kw.length - a.kw.length,
  );
  for (const entry of sortedMovingKws) {
    const lowerKw = entry.kw.toLowerCase();
    const info = {
      category: entry.category,
      tier: entry.tier,
      weight: entry.weight,
      label: entry.label,
    };
    MOVING_KEYWORD_MAP.set(lowerKw, info);
    const escaped = lowerKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    MOVING_KEYWORD_REGEXES.push({
      kw: lowerKw,
      info,
      regex: new RegExp(`\\b${escaped}\\b`, "gi"),
    });
  }

  const MOVING_NEGATIVE_MAP = new Map();
  const sortedMovingNeg = [...MOVING_NEGATIVE_KEYWORDS].sort(
    (a, b) => b.length - a.length,
  );
  for (const kw of sortedMovingNeg) {
    MOVING_NEGATIVE_MAP.set(kw.toLowerCase(), -10);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION D: ELEMENT CONTEXT WEIGHTS (shared by both modes)
  // ══════════════════════════════════════════════════════════════════════════

  function getElementContext(el) {
    if (!el || el.nodeType !== 1) return { value: 1, zone: "body" };

    const tag = el.tagName.toLowerCase();
    const cls = (
      el.className && typeof el.className === "string" ? el.className : ""
    ).toLowerCase();
    const id = (el.id || "").toLowerCase();

    const inHero = !!el.closest(
      'header, [class*="hero"], [class*="banner"], [class*="masthead"], [id*="hero"], [id*="banner"]',
    );
    const inNav = !!el.closest(
      'nav, [class*="nav"], [class*="menu"], [role="navigation"]',
    );
    const inFooter = !!el.closest('footer, [class*="footer"], [id*="footer"]');
    const inService = !!el.closest(
      '[class*="service"], [class*="offer"], [class*="what-we-do"], [class*="services"]',
    );
    const inCTA = !!el.closest('[class*="cta"], [class*="call-to-action"]');

    if (inHero && (tag === "h1" || tag === "h2"))
      return { value: 10, zone: "hero-heading" };
    if (inHero) return { value: 7, zone: "hero" };
    if (tag === "h1") return { value: 9, zone: "h1" };
    if (inNav) return { value: 8, zone: "nav" };
    if (tag === "h2") return { value: 7, zone: "h2" };
    if (tag === "h3") return { value: 6, zone: "h3" };
    if (tag === "h4") return { value: 5, zone: "h4" };
    if (tag === "h5" || tag === "h6")
      return { value: 4, zone: "heading-minor" };
    if (inService) return { value: 6, zone: "service-section" };
    if (inCTA) return { value: 5, zone: "cta" };
    if (
      (tag === "button" || tag === "a") &&
      el.innerText &&
      el.innerText.trim().length < 60
    )
      return { value: 5, zone: "button/link" };
    if (tag === "p") return { value: 3, zone: "paragraph" };
    if (tag === "li") return { value: 3, zone: "list-item" };
    if (tag === "span" || tag === "div") return { value: 2, zone: "inline" };
    if (inFooter) return { value: 1, zone: "footer" };
    return { value: 2, zone: "body" };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION E: VISIBILITY CHECK (shared)
  // ══════════════════════════════════════════════════════════════════════════

  function isElementVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    try {
      const style = window.getComputedStyle(el);
      if (style.display === "none") return false;
      if (style.visibility === "hidden") return false;
      if (style.opacity === "0") return false;
      return true;
    } catch (e) {
      return true;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION F: TEXT EXTRACTION STRATEGIES (shared by both modes)
  // Content is extracted ONCE and reused by whichever engine is active.
  // ══════════════════════════════════════════════════════════════════════════


  function extractFromTreeWalker() {
    const results = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (
            [
              "SCRIPT",
              "STYLE",
              "NOSCRIPT",
              "META",
              "HEAD",
              "TEMPLATE",
            ].includes(tag)
          )
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

  function extractFromHighValueSelectors() {
    const results = [];
    const selectors = [
      "h1, h2, h3, h4, h5, h6",
      'nav a, nav li, [class*="nav"] a, [class*="menu"] a, [role="navigation"] a',
      '[class*="hero"] *, [class*="banner"] *, [class*="masthead"] *',
      '[id*="hero"] *, [id*="banner"] *',
      '[class*="service"] *, [class*="offer"] *',
      'button, [class*="cta"] *, [class*="call-to-action"] *',
      '[class*="card"] *, [class*="feature"] *',
      "main li, article li, section li",
    ];

    const seenElements = new Set();
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (seenElements.has(el)) continue;
          seenElements.add(el);
          const text = (el.innerText || el.textContent || "").trim();
          if (text.length >= 2 && text.length <= 500) {
            results.push({ text, element: el });
          }
          const ariaLabel = el.getAttribute("aria-label");
          if (ariaLabel && ariaLabel.trim().length >= 2)
            results.push({ text: ariaLabel.trim(), element: el });
          const titleAttr = el.getAttribute("title");
          if (titleAttr && titleAttr.trim().length >= 2)
            results.push({ text: titleAttr.trim(), element: el });
          if (el.tagName === "IMG") {
            const alt = el.getAttribute("alt");
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

  function extractFromMeta() {
    const results = [];
    const title = document.title || "";
    const metaDesc =
      document.querySelector('meta[name="description"]')?.content || "";
    const metaKw =
      document.querySelector('meta[name="keywords"]')?.content || "";
    const ogTitle =
      document.querySelector('meta[property="og:title"]')?.content || "";
    const ogDesc =
      document.querySelector('meta[property="og:description"]')?.content || "";

    let jsonLdText = "";
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((s) => {
        try {
          const data = JSON.parse(s.textContent);
          jsonLdText += " " + JSON.stringify(data);
        } catch (e) {}
      });

    const urlText = window.location.pathname + " " + window.location.hostname;

    const metaCombined = [title, metaDesc, metaKw, ogTitle, ogDesc, urlText]
      .filter(Boolean)
      .join(" ");

    if (metaCombined.trim()) {
      results.push({
        text: metaCombined,
        element: null,
        zone: "meta",
        weight: 8,
      });
    }
    if (jsonLdText.trim()) {
      results.push({
        text: jsonLdText,
        element: null,
        zone: "structured-data",
        weight: 7,
      });
    }
    return results;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION G: KEYWORD MATCHING FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  function findMatchesInMap(text, keywordMap) {
    const lower = text.toLowerCase();
    const matches = [];
    const alreadyMatched = new Set();

    for (const [kw, info] of keywordMap) {
      if (lower.includes(kw)) {
        const key = info.category + "|" + kw;
        if (!alreadyMatched.has(key)) {
          alreadyMatched.add(key);
          const idx = lower.indexOf(kw);
          const start = Math.max(0, idx - 40);
          const end = Math.min(text.length, idx + kw.length + 40);
          const snippet = text.substring(start, end).trim();
          matches.push({ kw, ...info, snippet });
        }
      }
    }
    return matches;
  }

  function findHardscapeMatches(text) {
    return findMatchesInMap(text, KEYWORD_MAP);
  }

  function findHvacMatches(text) {
    return findMatchesInMap(text, HVAC_KEYWORD_MAP);
  }

  // ── Roofing Non-Contractor Idioms & False Positive Suppression ──
  const ROOFING_IDIOM_PATTERNS = [
    /\b(?:all\s+)?(?:under\s+(?:one|the\s+same|our)\s+roof)\b/gi,
    /\b(?:everything\s+under\s+(?:one|our)\s+roof)\b/gi,
    /\b(?:services?\s+under\s+one\s+roof)\b/gi,
    /\b(?:solutions?\s+under\s+one\s+roof)\b/gi,
    /\b(?:through\s+the\s+roof)\b/gi,
    /\b(?:rais(?:e|ing)\s+the\s+roof)\b/gi,
    /\b(?:flooring|carpet|vinyl|laminate|tile|subfloor)\s+underlayment\b/gi,
    /\bshingles\s+(?:vaccine|vaccination|outbreak|virus|treatment|shot|symptoms?)\b/gi,
  ];

  // ── Moving Non-Mover Idioms & False Positive Suppression ──
  // These idiom patterns match common non-moving uses of the word "moving"
  // They are masked before keyword matching to prevent false positives.
  const MOVING_IDIOM_PATTERNS = [
    // Business motivation / marketing language
    /\bmoving\s+(?:your\s+)?(?:business|brand|company|organization)\s+(?:forward|ahead|to\s+the\s+next\s+level)\b/gi,
    /\bmoving\s+(?:forward|ahead|onwards?)\b/gi,
    /\b(?:keep|keeps|kept)\s+(?:things?|us|you|it)?\s*moving\b/gi,
    /\bmoving\s+(?:into|toward|towards)\s+(?:the\s+)?(?:future|digital|next)/gi,
    // Real-estate agent language
    /\bmoving\s+(?:you\s+)?(?:into|to)\s+(?:your\s+)?(?:dream|new|perfect)\s+(?:home|house)/gi,
    /\bhelp(?:ing)?\s+(?:you\s+|families?\s+|people\s+)?(?:find|discover|buy|purchase)\s+(?:a\s+|your\s+)?(?:home|house|property)/gi,
    // Motivational / generic
    /\bmoving\s+(?:experience|journey|story|inspiration)/gi,
    /\bemotionally\s+moving\b/gi,
    /\bmoving\s+(?:speech|tribute|moment|performance|film|movie|art|music)/gi,
  ];

  function findMovingMatches(text) {
    if (!text || typeof text !== "string") return [];

    // Mask non-mover idioms before matching to prevent false positives
    let sanitized = text;
    for (const pat of MOVING_IDIOM_PATTERNS) {
      sanitized = sanitized.replace(pat, (m) => " ".repeat(m.length));
    }

    const matches = [];
    const matchedSpans = [];
    const alreadyMatched = new Set();

    // Iterate through precompiled regexes (sorted longest-keyword-first)
    for (const { kw, info, regex } of MOVING_KEYWORD_REGEXES) {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(sanitized)) !== null) {
        const start = m.index;
        const end   = start + m[0].length;

        // Prevent shorter sub-matches inside an already-matched span
        const alreadyCovered = matchedSpans.some(
          (span) => start >= span.start && end <= span.end,
        );
        if (alreadyCovered) continue;

        const key = info.category + "|" + kw;
        if (!alreadyMatched.has(key)) {
          alreadyMatched.add(key);
          const snipStart = Math.max(0, start - 40);
          const snipEnd   = Math.min(text.length, end + 40);
          const snippet   = text.substring(snipStart, snipEnd).trim();
          matches.push({ kw, ...info, snippet });
        }
        matchedSpans.push({ start, end, tier: info.tier });
      }
    }
    return matches;
  }

  function findRoofingMatches(text) {
    if (!text || typeof text !== "string") return [];

    // Mask non-roofing idioms with spaces of equal length to preserve offsets
    let sanitized = text;
    for (const pat of ROOFING_IDIOM_PATTERNS) {
      sanitized = sanitized.replace(pat, (m) => " ".repeat(m.length));
    }

    const matches = [];
    const matchedSpans = [];
    const alreadyMatched = new Set();

    // Iterate through precompiled regexes (sorted longest keyword first)
    for (const { kw, info, regex } of ROOFING_KEYWORD_REGEXES) {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(sanitized)) !== null) {
        const start = m.index;
        const end = start + m[0].length;

        // Prevent shorter / lower-tier sub-matches inside an already matched span
        // e.g. "roof installation" won't also trigger a separate match for "roof"
        const alreadyCovered = matchedSpans.some(
          (span) => start >= span.start && end <= span.end,
        );
        if (alreadyCovered) continue;

        const key = info.category + "|" + kw;
        if (!alreadyMatched.has(key)) {
          alreadyMatched.add(key);
          const snipStart = Math.max(0, start - 40);
          const snipEnd = Math.min(text.length, end + 40);
          const snippet = text.substring(snipStart, snipEnd).trim();
          matches.push({ kw, ...info, snippet });
        }
        matchedSpans.push({ start, end, tier: info.tier });
      }
    }
    return matches;
  }

  function findNegativesInMap(text, negativeMap) {
    const lower = text.toLowerCase();
    const hits = [];
    const alreadyMatched = new Set();
    for (const [kw] of negativeMap) {
      if (!alreadyMatched.has(kw) && lower.includes(kw)) {
        alreadyMatched.add(kw);
        hits.push(kw);
      }
    }
    return hits;
  }

  function findSecondaryMatches(text) {
    const lower = text.toLowerCase();
    const hits = [];
    const seen = new Set();
    for (const [kw, label] of SECONDARY_MAP) {
      if (!seen.has(label) && lower.includes(kw)) {
        seen.add(label);
        hits.push(label);
      }
    }
    return hits;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION H: XPATH HELPER (shared)
  // ══════════════════════════════════════════════════════════════════════════

  function getXPath(el) {
    if (!el || el === document.body) return "/html/body";
    if (el.id) return `//*[@id="${el.id}"]`;
    const tag = el.tagName.toLowerCase();
    let index = 1;
    let sib = el.previousElementSibling;
    while (sib) {
      if (sib.tagName === el.tagName) index++;
      sib = sib.previousElementSibling;
    }
    return getXPath(el.parentElement) + `/${tag}[${index}]`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION I: MAIN ANALYSIS ENGINE
  // Accepts opts.mode = 'hardscaping' | 'hvac'
  // ══════════════════════════════════════════════════════════════════════════

  window.__remodelAnalyzer = function (opts = {}) {
    const startTime = performance.now();
    const mode = (opts.mode || "hardscaping").toLowerCase();

    const isHvac   = mode === "hvac";
    const isRoof   = mode === "roofing";
    const isMoving = mode === "moving";
    const matchFn  = isHvac ? findHvacMatches : isRoof ? findRoofingMatches : isMoving ? findMovingMatches : findHardscapeMatches;
    const negMap   = isHvac ? HVAC_NEGATIVE_MAP : isRoof ? ROOFING_NEGATIVE_MAP : isMoving ? MOVING_NEGATIVE_MAP : NEGATIVE_MAP;
    const modeLabel = isHvac ? "HVAC" : isRoof ? "Roofing" : isMoving ? "Moving" : "Hardscape";

    console.log(`\ud83d\udd0d [Finder v5.0] Starting ${modeLabel} scan...`);

    const findings = [];
    const debugLog = [];
    const pageUrl = window.location.href;
    const pageTitle = document.title || "";
    const negativeHits = [];
    const secondaryFound = new Set();

    // ── Collect text from all strategies (extracted ONCE regardless of mode) ──
    const { items: walkerItems, count: walkerCount } = extractFromTreeWalker();
    const selectorItems = extractFromHighValueSelectors();
    const metaItems = extractFromMeta();

    debugLog.push(`Mode: ${modeLabel}`);

    const allItems = [
      ...metaItems.map((i) => ({ ...i, source: "meta" })),
      ...walkerItems.map((i) => ({ ...i, source: "walker" })),
      ...selectorItems.map((i) => ({ ...i, source: "selector" })),
    ];

    let totalTextLength = 0;
    let totalKeywordHits = 0;

    for (const item of allItems) {
      const text = item.text;
      if (!text || text.length < 2) continue;
      totalTextLength += text.length;

      // Run mode-appropriate keyword matching
      const matches = matchFn(text);
      totalKeywordHits += matches.length;

      for (const match of matches) {
        let weight, zone;

        if (item.weight) {
          weight = item.weight;
          zone = item.zone || "meta";
        } else if (item.element) {
          const ctx = getElementContext(item.element);
          weight = match.weight * ctx.value;
          zone = ctx.zone;
        } else {
          weight = match.weight;
          zone = "unknown";
        }

        const xpath = item.element ? getXPath(item.element) : "/html/head";
        const tag = item.element ? item.element.tagName.toLowerCase() : "meta";

        findings.push({
          category: match.category,
          matchedTerm: match.kw,
          tier: match.tier,
          weight,
          kwBaseWeight: match.weight,
          label: match.label,
          snippet: match.snippet,
          zone,
          url: pageUrl,
          xpath,
          tag,
          element: item.element,
        });
      }

      // Negative keyword scan (mode-specific)
      const negMatches = findNegativesInMap(text, negMap);
      for (const neg of negMatches) {
        if (!negativeHits.includes(neg)) negativeHits.push(neg);
      }

      // Secondary service scan (hardscaping mode only — HVAC, Roofing and Moving don't need these)
      if (!isHvac && !isRoof && !isMoving) {
        const secMatches = findSecondaryMatches(text);
        for (const sec of secMatches) secondaryFound.add(sec);
      }
    }

    const elapsed = (performance.now() - startTime).toFixed(1);
    debugLog.push(`Total text extracted: ${totalTextLength} chars`);
    debugLog.push(`Positive keyword hits: ${totalKeywordHits}`);
    debugLog.push(`Negative keyword hits: ${negativeHits.length}`);
    if (!isHvac && !isRoof && !isMoving)
      debugLog.push(`Secondary service signals: ${secondaryFound.size}`);
    debugLog.push(`Total findings: ${findings.length}`);
    debugLog.push(`Scan time: ${elapsed}ms`);

    console.log(
      `✅ [Finder v5.0] ${findings.length} ${modeLabel} matches in ${elapsed}ms`,
    );

    // Fallback: full body scan if nothing found
    if (findings.length === 0) {
      console.warn(
        `⚠️ No ${modeLabel} keywords found. Trying full body fallback...`,
      );
      const bodyText = document.body.innerText || "";
      const fallbackMatches = matchFn(bodyText);
      for (const match of fallbackMatches) {
        findings.push({
          category: match.category,
          matchedTerm: match.kw,
          tier: match.tier,
          weight: match.weight,
          kwBaseWeight: match.weight,
          label: match.label,
          snippet: match.snippet,
          zone: "fallback-body",
          url: pageUrl,
          xpath: "/html/body",
          tag: "body",
          element: null,
        });
      }
      const bodyNegatives = findNegativesInMap(bodyText, negMap);
      for (const neg of bodyNegatives) {
        if (!negativeHits.includes(neg)) negativeHits.push(neg);
      }
    }

    return {
      mode,
      findings,
      negativeHits,
      secondaryServices: [...secondaryFound],
      pageUrl,
      pageTitle,
      totalNodes: walkerCount,
      totalText: totalTextLength,
      totalHits: totalKeywordHits,
      debugLog,
      scanTime: elapsed,
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION J: HIGHLIGHT STYLES (both modes)
  // ══════════════════════════════════════════════════════════════════════════

  const HARDSCAPE_HIGHLIGHT_STYLES = {
    patios: { bg: "rgba(245,158,11,0.40)", border: "#d97706", text: "#78350f" },
    walls: { bg: "rgba(148,163,184,0.40)", border: "#64748b", text: "#1e293b" },
    outdoor_living: {
      bg: "rgba(249,115,22,0.40)",
      border: "#ea580c",
      text: "#7c2d12",
    },
    walkways_drives: {
      bg: "rgba(96,165,250,0.40)",
      border: "#2563eb",
      text: "#1e3a8a",
    },
    water_landscape: {
      bg: "rgba(52,211,153,0.40)",
      border: "#059669",
      text: "#064e3b",
    },
    site_work: {
      bg: "rgba(167,139,250,0.40)",
      border: "#7c3aed",
      text: "#3b0764",
    },
  };

  const HVAC_HIGHLIGHT_STYLES = {
    heating: { bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
    cooling: {
      bg: "rgba(59,130,246,0.35)",
      border: "#2563eb",
      text: "#1e3a8a",
    },
    heat_pumps: {
      bg: "rgba(139,92,246,0.35)",
      border: "#7c3aed",
      text: "#3b0764",
    },
    indoor_air_quality: {
      bg: "rgba(6,182,212,0.35)",
      border: "#0891b2",
      text: "#164e63",
    },
    ductwork: {
      bg: "rgba(245,158,11,0.35)",
      border: "#d97706",
      text: "#78350f",
    },
    maintenance: {
      bg: "rgba(16,185,129,0.35)",
      border: "#059669",
      text: "#064e3b",
    },
    emergency: {
      bg: "rgba(249,115,22,0.35)",
      border: "#ea580c",
      text: "#7c2d12",
    },
    commercial_hvac: {
      bg: "rgba(100,116,139,0.35)",
      border: "#475569",
      text: "#1e293b",
    },
    refrigeration: {
      bg: "rgba(14,165,233,0.35)",
      border: "#0284c7",
      text: "#0c4a6e",
    },
  };

  const ROOFING_HIGHLIGHT_STYLES = {
    roof_replacement:  { bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
    roof_repair:       { bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
    roof_installation: { bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
    roofing_materials: { bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
    commercial_roofing:{ bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
    emergency_roofing: { bg: "rgba(239,68,68,0.35)", border: "#dc2626", text: "#7f1d1d" },
  };

  const MOVING_HIGHLIGHT_STYLES = {
    moving_company:  { bg: "rgba(139,92,246,0.35)",  border: "#7c3aed", text: "#3b0764" },
    residential:     { bg: "rgba(124,58,237,0.35)",  border: "#6d28d9", text: "#3b0764" },
    commercial:      { bg: "rgba(109,40,217,0.35)",  border: "#5b21b6", text: "#2d1b69" },
    long_distance:   { bg: "rgba(167,139,250,0.35)", border: "#8b5cf6", text: "#4c1d95" },
    packing:         { bg: "rgba(196,181,253,0.35)", border: "#a78bfa", text: "#4c1d95" },
    moving_storage:  { bg: "rgba(221,214,254,0.35)", border: "#c4b5fd", text: "#4c1d95" },
  };

  const HIGHLIGHT_STYLE_ID = "__finder_hl_styles__";
  const HIGHLIGHT_MARK_ATTR = "data-finder-hl";

  function injectHighlightStyles(mode) {
    const existing = document.getElementById(HIGHLIGHT_STYLE_ID);
    if (existing) existing.remove();

    const styles =
      mode === "hvac"    ? HVAC_HIGHLIGHT_STYLES
      : mode === "roofing" ? ROOFING_HIGHLIGHT_STYLES
      : mode === "moving"  ? MOVING_HIGHLIGHT_STYLES
      : HARDSCAPE_HIGHLIGHT_STYLES;
    const style = document.createElement("style");
    style.id = HIGHLIGHT_STYLE_ID;
    style.textContent =
      Object.entries(styles)
        .map(
          ([cat, s]) => `
        mark[${HIGHLIGHT_MARK_ATTR}="${cat}"] {
          background: ${s.bg} !important;
          color: ${s.text} !important;
          outline: 1.5px solid ${s.border} !important;
          border-radius: 3px !important;
          padding: 0 2px !important;
          box-shadow: 0 1px 4px ${s.border}55 !important;
          text-decoration: none !important;
          animation: __finder_hl_pop__ 0.35s ease-out !important;
        }
      `,
        )
        .join("\n") +
      `
      @keyframes __finder_hl_pop__ {
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

  function highlightTermsOnPage(terms, mode) {
    if (!terms || terms.length === 0) return 0;
    injectHighlightStyles(mode || "hardscaping");

    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
    const escaped = sorted.map((t) =>
      t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");

    const termCatMap = new Map();
    for (const { term, categoryId } of sorted) {
      termCatMap.set(term.toLowerCase(), categoryId);
    }

    let count = 0;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (
            [
              "SCRIPT",
              "STYLE",
              "NOSCRIPT",
              "META",
              "HEAD",
              "TEMPLATE",
              "TEXTAREA",
              "INPUT",
            ].includes(tag)
          )
            return NodeFilter.FILTER_REJECT;
          if (tag === "MARK" && parent.hasAttribute(HIGHLIGHT_MARK_ATTR))
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
      let last = 0;
      let m;
      while ((m = regex.exec(raw)) !== null) {
        if (m.index > last)
          parts.push({ text: raw.slice(last, m.index), match: false });
        parts.push({
          text: m[0],
          match: true,
          catId:
            termCatMap.get(m[0].toLowerCase()) ||
            (mode === "hvac" ? "cooling" : mode === "roofing" ? "roof_replacement" : mode === "moving" ? "moving_company" : "patios"),
        });
        last = m.index + m[0].length;
        count++;
      }
      if (last < raw.length)
        parts.push({ text: raw.slice(last), match: false });
      if (parts.length <= 1 && !parts[0]?.match) continue;

      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (!part.match) {
          frag.appendChild(document.createTextNode(part.text));
        } else {
          const mark = document.createElement("mark");
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

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION K: MESSAGE LISTENER
  // ══════════════════════════════════════════════════════════════════════════

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanCurrentPage") {
      try {
        const mode = request.mode || "hardscaping";
        const data = window.__remodelAnalyzer({ debug: true, mode });
        sendResponse(data);
      } catch (e) {
        console.error("[Finder v5.0] Fatal error:", e);
        sendResponse({ error: e.message, findings: [], totalNodes: 0 });
      }
      return true;
    }

    if (request.action === "highlightKeywords") {
      try {
        clearHighlights();
        const count = highlightTermsOnPage(
          request.terms || [],
          request.mode || "hardscaping",
        );
        sendResponse({ success: true, highlightCount: count });
      } catch (e) {
        console.error("[Finder v5.0] Highlight error:", e);
        sendResponse({ success: false, error: e.message });
      }
      return true;
    }

    if (request.action === "clearHighlights") {
      try {
        clearHighlights();
        sendResponse({ success: true });
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
      return true;
    }

    if (request.action === "scrollTo") {
      const { xpath } = request;
      try {
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        );
        const el = result.singleNodeValue;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          const prev = {
            bg: el.style.backgroundColor,
            outline: el.style.outline,
            transition: el.style.transition,
          };
          el.style.transition = "background-color 0.2s, outline 0.2s";
          el.style.backgroundColor = "#fde047";
          el.style.outline = "3px solid #f59e0b";
          setTimeout(() => {
            el.style.backgroundColor = prev.bg || "";
            el.style.outline = prev.outline || "";
            el.style.transition = prev.transition || "";
          }, 2500);
          sendResponse({ success: true });
        } else {
          sendResponse({
            success: false,
            error: "Element not found via XPath",
          });
        }
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
      return true;
    }

    return true;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION L: COMPANY LOCATION EXTRACTION ENGINE
  // Identifies the company's primary physical city & state using multi-signal
  // evidence. Prioritises structured data, footer/contact addresses, and maps
  // embeds over generic service-area mentions.
  // ══════════════════════════════════════════════════════════════════════════

  // ── US State Abbreviation → Full Name ──
  const US_STATES = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "District of Columbia",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  // Full state names (lowercase) for matching
  const US_STATE_NAMES_LOWER = new Set(
    Object.values(US_STATES).map((s) => s.toLowerCase()),
  );

  // State abbreviations for regex
  const STATE_ABBR_LIST = Object.keys(US_STATES).join("|");

  // ── Service-Area Suppression Patterns ──
  // Text containing these patterns indicates a list of service areas, NOT a business address.
  const SERVICE_AREA_PATTERNS = [
    /\b(serv(?:ing|ice[sd]?)|areas?\s+(?:we\s+)?serv(?:e|ed)|service\s+area[s]?|serving\s+the\s+(?:greater|entire|local)|proud(?:ly)?\s+serv(?:ing|e))\b/i,
    /\b(communit(?:y|ies)\s+(?:we\s+)?serv(?:e|ed)|neighborhoods?\s+(?:we\s+)?serv(?:e|ed)|locations?\s+(?:we\s+)?serv(?:e|ed))\b/i,
    /\b(and\s+surrounding\s+area[s]?|and\s+nearby\s+cit(?:y|ies)|and\s+the\s+surrounding)\b/i,
    /\b(project[s]?\s+(?:in|near|around)|we\s+work\s+(?:in|near|around|throughout))\b/i,
  ];

  // ── Phone Area Code → State (US) ──
  // Covers the most common area codes; best-effort only (used as low-confidence signal)
  const AREA_CODE_STATE = {
    205: "Alabama",
    251: "Alabama",
    256: "Alabama",
    334: "Alabama",
    907: "Alaska",
    480: "Arizona",
    520: "Arizona",
    602: "Arizona",
    623: "Arizona",
    928: "Arizona",
    479: "Arkansas",
    501: "Arkansas",
    870: "Arkansas",
    209: "California",
    213: "California",
    310: "California",
    323: "California",
    408: "California",
    415: "California",
    424: "California",
    442: "California",
    510: "California",
    530: "California",
    559: "California",
    562: "California",
    619: "California",
    626: "California",
    628: "California",
    650: "California",
    657: "California",
    661: "California",
    669: "California",
    707: "California",
    714: "California",
    747: "California",
    760: "California",
    805: "California",
    818: "California",
    831: "California",
    858: "California",
    909: "California",
    916: "California",
    925: "California",
    949: "California",
    951: "California",
    303: "Colorado",
    719: "Colorado",
    720: "Colorado",
    970: "Colorado",
    203: "Connecticut",
    475: "Connecticut",
    860: "Connecticut",
    959: "Connecticut",
    302: "Delaware",
    202: "District of Columbia",
    239: "Florida",
    305: "Florida",
    321: "Florida",
    352: "Florida",
    386: "Florida",
    407: "Florida",
    561: "Florida",
    727: "Florida",
    754: "Florida",
    772: "Florida",
    786: "Florida",
    813: "Florida",
    850: "Florida",
    863: "Florida",
    904: "Florida",
    941: "Florida",
    954: "Florida",
    229: "Georgia",
    404: "Georgia",
    470: "Georgia",
    478: "Georgia",
    678: "Georgia",
    706: "Georgia",
    762: "Georgia",
    770: "Georgia",
    912: "Georgia",
    808: "Hawaii",
    208: "Idaho",
    217: "Illinois",
    224: "Illinois",
    309: "Illinois",
    312: "Illinois",
    331: "Illinois",
    618: "Illinois",
    630: "Illinois",
    708: "Illinois",
    773: "Illinois",
    815: "Illinois",
    847: "Illinois",
    872: "Illinois",
    219: "Indiana",
    260: "Indiana",
    317: "Indiana",
    463: "Indiana",
    574: "Indiana",
    765: "Indiana",
    812: "Indiana",
    930: "Indiana",
    319: "Iowa",
    515: "Iowa",
    563: "Iowa",
    641: "Iowa",
    712: "Iowa",
    316: "Kansas",
    620: "Kansas",
    785: "Kansas",
    913: "Kansas",
    270: "Kentucky",
    364: "Kentucky",
    502: "Kentucky",
    606: "Kentucky",
    859: "Kentucky",
    225: "Louisiana",
    318: "Louisiana",
    337: "Louisiana",
    504: "Louisiana",
    985: "Louisiana",
    207: "Maine",
    240: "Maryland",
    301: "Maryland",
    410: "Maryland",
    443: "Maryland",
    667: "Maryland",
    339: "Massachusetts",
    351: "Massachusetts",
    413: "Massachusetts",
    508: "Massachusetts",
    617: "Massachusetts",
    774: "Massachusetts",
    781: "Massachusetts",
    857: "Massachusetts",
    978: "Massachusetts",
    231: "Michigan",
    248: "Michigan",
    269: "Michigan",
    313: "Michigan",
    517: "Michigan",
    586: "Michigan",
    616: "Michigan",
    734: "Michigan",
    810: "Michigan",
    906: "Michigan",
    947: "Michigan",
    989: "Michigan",
    218: "Minnesota",
    320: "Minnesota",
    507: "Minnesota",
    612: "Minnesota",
    651: "Minnesota",
    763: "Minnesota",
    952: "Minnesota",
    228: "Mississippi",
    601: "Mississippi",
    662: "Mississippi",
    769: "Mississippi",
    314: "Missouri",
    417: "Missouri",
    557: "Missouri",
    573: "Missouri",
    636: "Missouri",
    660: "Missouri",
    816: "Missouri",
    406: "Montana",
    308: "Nebraska",
    402: "Nebraska",
    531: "Nebraska",
    702: "Nevada",
    725: "Nevada",
    775: "Nevada",
    603: "New Hampshire",
    201: "New Jersey",
    551: "New Jersey",
    609: "New Jersey",
    640: "New Jersey",
    732: "New Jersey",
    848: "New Jersey",
    856: "New Jersey",
    862: "New Jersey",
    908: "New Jersey",
    973: "New Jersey",
    505: "New Mexico",
    575: "New Mexico",
    212: "New York",
    315: "New York",
    332: "New York",
    347: "New York",
    516: "New York",
    518: "New York",
    585: "New York",
    607: "New York",
    631: "New York",
    646: "New York",
    680: "New York",
    716: "New York",
    718: "New York",
    838: "New York",
    845: "New York",
    914: "New York",
    917: "New York",
    929: "New York",
    934: "New York",
    252: "North Carolina",
    336: "North Carolina",
    704: "North Carolina",
    743: "North Carolina",
    828: "North Carolina",
    910: "North Carolina",
    919: "North Carolina",
    980: "North Carolina",
    984: "North Carolina",
    701: "North Dakota",
    216: "Ohio",
    220: "Ohio",
    234: "Ohio",
    330: "Ohio",
    380: "Ohio",
    419: "Ohio",
    440: "Ohio",
    513: "Ohio",
    567: "Ohio",
    614: "Ohio",
    740: "Ohio",
    937: "Ohio",
    405: "Oklahoma",
    539: "Oklahoma",
    580: "Oklahoma",
    918: "Oklahoma",
    458: "Oregon",
    503: "Oregon",
    541: "Oregon",
    971: "Oregon",
    215: "Pennsylvania",
    223: "Pennsylvania",
    267: "Pennsylvania",
    272: "Pennsylvania",
    412: "Pennsylvania",
    445: "Pennsylvania",
    484: "Pennsylvania",
    570: "Pennsylvania",
    610: "Pennsylvania",
    717: "Pennsylvania",
    724: "Pennsylvania",
    814: "Pennsylvania",
    878: "Pennsylvania",
    401: "Rhode Island",
    803: "South Carolina",
    839: "South Carolina",
    843: "South Carolina",
    854: "South Carolina",
    864: "South Carolina",
    605: "South Dakota",
    423: "Tennessee",
    615: "Tennessee",
    629: "Tennessee",
    731: "Tennessee",
    865: "Tennessee",
    901: "Tennessee",
    931: "Tennessee",
    210: "Texas",
    214: "Texas",
    254: "Texas",
    281: "Texas",
    325: "Texas",
    346: "Texas",
    361: "Texas",
    409: "Texas",
    430: "Texas",
    432: "Texas",
    469: "Texas",
    512: "Texas",
    682: "Texas",
    713: "Texas",
    726: "Texas",
    737: "Texas",
    806: "Texas",
    817: "Texas",
    830: "Texas",
    832: "Texas",
    903: "Texas",
    915: "Texas",
    936: "Texas",
    940: "Texas",
    945: "Texas",
    956: "Texas",
    972: "Texas",
    979: "Texas",
    385: "Utah",
    435: "Utah",
    801: "Utah",
    802: "Vermont",
    276: "Virginia",
    434: "Virginia",
    540: "Virginia",
    571: "Virginia",
    703: "Virginia",
    757: "Virginia",
    804: "Virginia",
    206: "Washington",
    253: "Washington",
    360: "Washington",
    425: "Washington",
    509: "Washington",
    564: "Washington",
    304: "West Virginia",
    681: "West Virginia",
    262: "Wisconsin",
    414: "Wisconsin",
    534: "Wisconsin",
    608: "Wisconsin",
    715: "Wisconsin",
    920: "Wisconsin",
    307: "Wyoming",
  };

  // ── Address Regex Patterns ──
  // Matches "City, ST 12345" or "City, State"
  const ADDR_FULL_RE = new RegExp(
    `([A-Za-z][A-Za-z\\s\\.\\-]{1,30}),\\s*(${STATE_ABBR_LIST})\\b(?:\\s+\\d{5}(?:-\\d{4})?)?`,
    "gi",
  );

  const ADDR_FULLSTATE_RE = new RegExp(
    `([A-Za-z][A-Za-z\\s\\.\\-]{1,30}),\\s*(${Object.values(US_STATES).join("|")})\\b`,
    "gi",
  );

  // Street-number prefix — helps confirm a text block is an actual address
  const STREET_NUMBER_RE = /\b\d{1,5}\s+[A-Za-z]/;

  // ── Utility: normalize state to full name ──
  function normalizeState(raw) {
    if (!raw) return null;
    const upper = raw.trim().toUpperCase();
    if (US_STATES[upper]) return US_STATES[upper];
    const lower = raw.trim().toLowerCase();
    for (const full of Object.values(US_STATES)) {
      if (full.toLowerCase() === lower) return full;
    }
    return null;
  }

  // ── Utility: normalize city name ──
  function normalizeCity(raw) {
    if (!raw) return null;
    return raw
      .trim()
      .replace(/\s+/g, " ")
      .replace(/^(city\s+of\s+)/i, "")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // ── Check if text appears to be in a service-area context ──
  function isServiceAreaContext(text) {
    return SERVICE_AREA_PATTERNS.some((re) => re.test(text));
  }

  // ── Parse city+state from a text string ──
  // Returns array of {city, state, hasStreetNumber} objects
  function parseAddressesFromText(text) {
    if (!text || text.length < 4) return [];
    const results = [];
    const seen = new Set();

    // Try "City, ST" / "City, ST XXXXX"
    const re1 = new RegExp(ADDR_FULL_RE.source, "gi");
    let m;
    while ((m = re1.exec(text)) !== null) {
      const city = normalizeCity(m[1]);
      const state = normalizeState(m[2]);
      if (!city || !state) continue;
      if (city.length < 2 || city.length > 35) continue;
      // Filter out false positives (single generic words)
      if (
        /^(the|and|for|our|new|old|north|south|east|west|upper|lower)$/i.test(
          city,
        )
      )
        continue;
      const key = `${city.toLowerCase()}|${state}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const hasStreetNum = STREET_NUMBER_RE.test(text);
      results.push({ city, state, hasStreetNumber: hasStreetNum });
    }

    // Try "City, Full State Name"
    const re2 = new RegExp(ADDR_FULLSTATE_RE.source, "gi");
    while ((m = re2.exec(text)) !== null) {
      const city = normalizeCity(m[1]);
      const state = normalizeState(m[2]);
      if (!city || !state) continue;
      if (city.length < 2 || city.length > 35) continue;
      const key = `${city.toLowerCase()}|${state}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const hasStreetNum = STREET_NUMBER_RE.test(text);
      results.push({ city, state, hasStreetNumber: hasStreetNum });
    }

    return results;
  }

  // ── Extract locations from JSON-LD / Microdata structured data ──
  function extractStructuredDataLocation() {
    const found = [];

    // JSON-LD
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((script) => {
        try {
          const parse = (obj) => {
            if (!obj || typeof obj !== "object") return;
            // Check for address-bearing types
            const types = []
              .concat(obj["@type"] || [])
              .map((t) => (t || "").toLowerCase());
            const isRelevant = types.some((t) =>
              [
                "localbusiness",
                "organization",
                "corporation",
                "restaurant",
                "store",
                "hotel",
                "place",
                "postaladdress",
                "contactpoint",
                "service",
                "professionalservice",
                "homeandconstructionbusiness",
              ].includes(t),
            );

            const addr = obj.address || obj.location?.address || null;
            if (addr) {
              const addrObj = typeof addr === "string" ? null : addr;
              const city =
                addrObj?.addressLocality || addrObj?.["@value"] || null;
              const stateRaw = addrObj?.addressRegion || null;
              if (city && stateRaw) {
                const state = normalizeState(stateRaw);
                if (state)
                  found.push({
                    city: normalizeCity(city),
                    state,
                    weight: 100,
                    source: "json-ld-schema",
                  });
              } else if (typeof addr === "string") {
                const parsed = parseAddressesFromText(addr);
                parsed.forEach((p) =>
                  found.push({ ...p, weight: 100, source: "json-ld-schema" }),
                );
              }
            }

            // Recursively check nested objects
            for (const key of Object.keys(obj)) {
              if (typeof obj[key] === "object" && obj[key] !== null)
                parse(obj[key]);
            }
          };

          const data = JSON.parse(script.textContent);
          if (Array.isArray(data)) data.forEach(parse);
          else parse(data);
        } catch (e) {}
      });

    // Microdata / RDFa
    document.querySelectorAll("[itemprop='addressLocality']").forEach((el) => {
      const cityRaw = (
        el.getAttribute("content") ||
        el.textContent ||
        ""
      ).trim();
      if (!cityRaw) return;
      // Look for sibling/parent addressRegion
      const parent = el.closest("[itemscope]") || el.parentElement;
      const regionEl = parent?.querySelector("[itemprop='addressRegion']");
      const stateRaw = regionEl
        ? (
            regionEl.getAttribute("content") ||
            regionEl.textContent ||
            ""
          ).trim()
        : "";
      const state = normalizeState(stateRaw);
      const city = normalizeCity(cityRaw);
      if (city) {
        if (state)
          found.push({ city, state, weight: 100, source: "microdata" });
        else
          found.push({
            city,
            state: null,
            weight: 60,
            source: "microdata-city-only",
          });
      }
    });

    return found;
  }

  // ── Extract location from Google Maps / other map embed src ──
  function extractGoogleMapsLocation(src) {
    if (!src) return null;
    try {
      // Standard embed: ...q=City+Name,+ST&... or place/City+Name,...
      const qMatch = src.match(/[?&]q=([^&]+)/i);
      if (qMatch) {
        const decoded = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
        const parsed = parseAddressesFromText(decoded);
        if (parsed.length > 0)
          return { ...parsed[0], weight: 80, source: "google-maps-embed" };
      }
      // Newer embed: /place/City+Name,+ST/...
      const placeMatch = src.match(/\/place\/([^/]+)/i);
      if (placeMatch) {
        const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
        const parsed = parseAddressesFromText(decoded);
        if (parsed.length > 0)
          return { ...parsed[0], weight: 75, source: "google-maps-place" };
      }
      // !2sCity+Name !3sState
      const s2 = src.match(/!2s([^!]+)/);
      if (s2) {
        const decoded = decodeURIComponent(s2[1].replace(/\+/g, " "));
        const parsed = parseAddressesFromText(decoded);
        if (parsed.length > 0)
          return { ...parsed[0], weight: 70, source: "google-maps-pin" };
      }
    } catch (e) {}
    return null;
  }

  // ── Score and select a primary location from evidence pool ──
  function resolveLocation(signals) {
    if (!signals || signals.length === 0) return null;

    // Aggregate scores per unique city+state pair
    const scoreMap = new Map();

    for (const sig of signals) {
      if (!sig.city) continue;
      const state = sig.state || "?";
      const key = `${sig.city.toLowerCase()}|${state.toLowerCase()}`;
      const prev = scoreMap.get(key) || {
        city: sig.city,
        state: sig.state,
        score: 0,
        sources: [],
        isServiceArea: false,
      };

      // Service area suppression: heavily penalise locations that ONLY appear in service-area context
      const addScore = sig.isServiceArea
        ? Math.round(sig.weight * 0.05)
        : sig.hasStreetNumber
          ? sig.weight * 1.5
          : sig.weight;
      prev.score += addScore;
      prev.sources.push(sig.source);
      if (sig.isServiceArea) prev.isServiceArea = true;
      scoreMap.set(key, prev);
    }

    // Sort by score descending
    const sorted = [...scoreMap.values()]
      .filter((e) => e.city && e.state)
      .sort((a, b) => b.score - a.score);

    if (sorted.length === 0) {
      // Try city-only entries as last resort
      const cityOnly = [...scoreMap.values()].filter((e) => e.city && !e.state);
      if (cityOnly.length === 0) return null;
      cityOnly.sort((a, b) => b.score - a.score);
      return {
        city: cityOnly[0].city,
        state: null,
        confidence: "low",
        others: [],
      };
    }

    const best = sorted[0];
    const others = sorted.slice(1).filter((e) => !e.isServiceArea);

    // Confidence thresholds
    let confidence;
    if (best.score >= 100) confidence = "high";
    else if (best.score >= 50) confidence = "medium";
    else confidence = "low";

    // If all entries appear to be service area only, downgrade confidence
    if (
      best.isServiceArea &&
      !best.sources.includes("json-ld-schema") &&
      !best.sources.includes("microdata")
    ) {
      confidence = "low";
    }

    return {
      city: best.city,
      state: best.state,
      confidence,
      others: others.map((o) => ({ city: o.city, state: o.state })),
      signals: best.sources,
    };
  }

  // ── Phone number area code extraction ──
  function extractAreaCodeState() {
    const phoneRe = /\((\d{3})\)\s*\d{3}-\d{4}|\b(\d{3})-\d{3}-\d{4}\b/g;
    const bodyText = document.body ? document.body.innerText || "" : "";
    let m;
    const states = new Map();
    while ((m = phoneRe.exec(bodyText)) !== null) {
      const code = m[1] || m[2];
      const state = AREA_CODE_STATE[code];
      if (state) states.set(state, (states.get(state) || 0) + 1);
    }
    // Return the most frequent
    if (states.size === 0) return null;
    const top = [...states.entries()].sort((a, b) => b[1] - a[1])[0];
    return top[0];
  }

  // ── Main: Collect all location signals from the page ──
  function extractCompanyLocation() {
    const allSignals = [];

    // ── Tier 1: Structured data ──
    const schemaLocs = extractStructuredDataLocation();
    allSignals.push(...schemaLocs);

    // ── Tier 2: High-value DOM zones ──
    const highValueSelectors = [
      // Footer
      { sel: "footer", weight: 70, label: "footer" },
      { sel: "[class*='footer']", weight: 70, label: "footer" },
      { sel: "[id*='footer']", weight: 70, label: "footer" },
      // Contact sections
      { sel: "[class*='contact']", weight: 65, label: "contact-section" },
      { sel: "[id*='contact']", weight: 65, label: "contact-section" },
      // Address tags
      { sel: "address", weight: 60, label: "address-tag" },
      // Header
      { sel: "header", weight: 55, label: "header" },
      { sel: "[class*='header']", weight: 55, label: "header" },
      // Location / about sections
      { sel: "[class*='location']", weight: 50, label: "location-section" },
      { sel: "[id*='location']", weight: 50, label: "location-section" },
      { sel: "[class*='about']", weight: 40, label: "about-section" },
      { sel: "[id*='about']", weight: 40, label: "about-section" },
      // Sidebar / info
      { sel: "[class*='sidebar']", weight: 35, label: "sidebar" },
      { sel: "[class*='info']", weight: 30, label: "info-block" },
    ];

    const processedEls = new Set();

    for (const { sel, weight, label } of highValueSelectors) {
      let els;
      try {
        els = document.querySelectorAll(sel);
      } catch (e) {
        continue;
      }
      for (const el of els) {
        if (processedEls.has(el)) continue;
        processedEls.add(el);

        const text = (el.innerText || el.textContent || "").trim();
        if (!text || text.length < 5) continue;

        const isServiceArea = isServiceAreaContext(text);
        const addresses = parseAddressesFromText(text);
        for (const addr of addresses) {
          allSignals.push({ ...addr, weight, source: label, isServiceArea });
        }
      }
    }

    // ── Tier 2b: Google Maps iframes ──
    document
      .querySelectorAll(
        'iframe[src*="google.com/maps"], iframe[src*="maps.google"]',
      )
      .forEach((iframe) => {
        const loc = extractGoogleMapsLocation(
          iframe.src || iframe.getAttribute("src") || "",
        );
        if (loc) allSignals.push({ ...loc, isServiceArea: false });
      });

    // ── Tier 3: Remaining visible page text (low priority) ──
    // Only scan if we don't have high-confidence signals yet
    const hasTier1 = allSignals.some((s) => s.weight >= 100);
    const hasTier2 = allSignals.some((s) => s.weight >= 55);

    if (!hasTier1 && !hasTier2) {
      // Meta tags
      const metaDesc =
        document.querySelector('meta[name="description"]')?.content || "";
      const pageTitle = document.title || "";
      const ogDesc =
        document.querySelector('meta[property="og:description"]')?.content ||
        "";
      for (const text of [metaDesc, pageTitle, ogDesc]) {
        if (!text) continue;
        const isServiceArea = isServiceAreaContext(text);
        const addresses = parseAddressesFromText(text);
        for (const addr of addresses) {
          allSignals.push({
            ...addr,
            weight: 20,
            source: "meta",
            isServiceArea,
          });
        }
      }
    }

    // ── Resolve primary location ──
    const result = resolveLocation(allSignals);

    // ── Tier 4: Area code fallback (state only, no city) ──
    let areaCodeState = null;
    if (!result || !result.state) {
      areaCodeState = extractAreaCodeState();
    }

    if (!result) {
      if (areaCodeState) {
        return {
          primaryCity: null,
          primaryState: areaCodeState,
          confidence: "low",
          otherLocations: [],
          signals: ["phone-area-code"],
          note: "State inferred from phone area code only",
        };
      }
      return {
        primaryCity: null,
        primaryState: null,
        confidence: "none",
        otherLocations: [],
        signals: [],
      };
    }

    return {
      primaryCity: result.city || null,
      primaryState: result.state || areaCodeState || null,
      confidence: result.confidence,
      otherLocations: result.others || [],
      signals: result.signals || [],
    };
  }

  // ── Location keywords that hint at a business address ──
  // These phrases commonly appear near a company's physical address.
  const LOCATION_KEYWORDS = [
    // "Located in" / "Based in" phrases
    /\b(locat(?:ed|ion)(?:\s+(?:in|at|near))?)\s+([A-Z][a-z])/g,
    /\b(bas(?:ed|e)(?:\s+(?:in|out\s+of))?)\s+([A-Z][a-z])/g,
    /\b(headquarter(?:ed|s)?(?:\s+(?:in|at))?)\s+([A-Z][a-z])/g,
    /\b(our\s+(?:office|location|headquarters|shop|showroom|facility|home\s+base)(?:\s+(?:is|are|in|at))?)/gi,
    /\b(visit\s+us\s+(?:at|in))\b/gi,
    /\b(find\s+us\s+(?:at|in))\b/gi,
    /\b(come\s+(?:see|visit)\s+us\b)/gi,
    /\b(we(?:'re|\s+are)\s+(?:located|based|situated)(?:\s+(?:in|at))?)/gi,
    /\b(proudly\s+(?:located|serving|based)\s+(?:in|out\s+of))\b/gi,
    /\b(local(?:ly)?\s+(?:owned|operated|based)(?:\s+(?:in|out\s+of))?)/gi,
    /\b(family[\s-]owned(?:\s+(?:and|&)\s+operated)?(?:\s+(?:in|out\s+of))?)/gi,
    /\b(serving\s+(?:the\s+)?(?:greater\s+)?[A-Z][a-z])/g,
    /\b(office(?:s)?\s+(?:in|at|near))\b/gi,
    /\b(get\s+directions)\b/gi,
    /\b(physical\s+(?:address|location))\b/gi,
    /\b(mailing\s+address)\b/gi,
  ];

  // ── Scan text for location hint keywords and return which ones matched ──
  function findLocationKeywords(text) {
    if (!text) return [];
    const matched = [];
    const concise = [
      "located in",
      "based in",
      "headquartered in",
      "our office",
      "our location",
      "visit us at",
      "find us at",
      "we are located",
      "we're located",
      "proudly serving",
      "locally owned",
      "family-owned",
      "serving the",
      "get directions",
      "physical address",
      "mailing address",
    ];
    const lc = text.toLowerCase();
    for (const kw of concise) {
      if (lc.includes(kw)) matched.push(kw);
    }
    return matched;
  }

  // ── Inject address highlight styles ──
  function injectAddressHighlightStyles() {
    const existingId = "__finder_addr_hl_styles__";
    const existing = document.getElementById(existingId);
    if (existing) existing.remove();
    const style = document.createElement("style");
    style.id = existingId;
    style.textContent = `
      mark[data-finder-hl="address"] {
        background: rgba(34,211,238,0.28) !important;
        color: inherit !important;
        outline: 2px solid #22d3ee !important;
        border-radius: 4px !important;
        padding: 1px 3px !important;
        box-shadow: 0 0 10px rgba(34,211,238,0.45) !important;
        text-decoration: none !important;
        animation: __finder_addr_pop__ 0.4s ease-out !important;
        cursor: default !important;
      }
      mark[data-finder-hl="address-kw"] {
        background: rgba(245,158,11,0.22) !important;
        color: inherit !important;
        outline: 1.5px solid #f59e0b !important;
        border-radius: 4px !important;
        padding: 1px 3px !important;
        box-shadow: 0 0 6px rgba(245,158,11,0.35) !important;
        text-decoration: none !important;
        animation: __finder_addr_pop__ 0.4s ease-out !important;
        cursor: default !important;
      }
      @keyframes __finder_addr_pop__ {
        from { opacity: 0; transform: scaleX(0.9); }
        to   { opacity: 1; transform: scaleX(1); }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // ── Highlight address text on the page (Address Finder mode only) ──
  function highlightAddressesOnPage(locationData) {
    if (!locationData) return 0;

    clearHighlights(); // Clear any existing highlights first
    injectAddressHighlightStyles();

    const city = locationData.primaryCity || null;
    const state = locationData.primaryState || null;
    if (!city && !state) return 0;

    // Build patterns to search for
    // 1. Full address patterns: "City, ST" or "City, State" with optional zip
    const addrPatterns = [];

    // State abbreviations map (reverse lookup)
    const stateAbbr = {
      Alabama: "AL",
      Alaska: "AK",
      Arizona: "AZ",
      Arkansas: "AR",
      California: "CA",
      Colorado: "CO",
      Connecticut: "CT",
      Delaware: "DE",
      "District of Columbia": "DC",
      Florida: "FL",
      Georgia: "GA",
      Hawaii: "HI",
      Idaho: "ID",
      Illinois: "IL",
      Indiana: "IN",
      Iowa: "IA",
      Kansas: "KS",
      Kentucky: "KY",
      Louisiana: "LA",
      Maine: "ME",
      Maryland: "MD",
      Massachusetts: "MA",
      Michigan: "MI",
      Minnesota: "MN",
      Mississippi: "MS",
      Missouri: "MO",
      Montana: "MT",
      Nebraska: "NE",
      Nevada: "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      Ohio: "OH",
      Oklahoma: "OK",
      Oregon: "OR",
      Pennsylvania: "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      Tennessee: "TN",
      Texas: "TX",
      Utah: "UT",
      Vermont: "VT",
      Virginia: "VA",
      Washington: "WA",
      "West Virginia": "WV",
      Wisconsin: "WI",
      Wyoming: "WY",
    };

    if (city && state) {
      const abbr = stateAbbr[state] || "";
      // "City, State" and "City, ST"
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      addrPatterns.push({
        re: new RegExp(
          `${esc(city)},?\\s+${esc(state)}(?:\\s+\\d{5}(?:-\\d{4})?)?`,
          "gi",
        ),
        type: "address",
      });
      if (abbr) {
        addrPatterns.push({
          re: new RegExp(
            `${esc(city)},?\\s+${abbr}(?:\\s+\\d{5}(?:-\\d{4})?)?\\b`,
            "g",
          ),
          type: "address",
        });
      }
      // Street-level: "123 [Street], City" — preceding address numbers
      addrPatterns.push({
        re: new RegExp(
          `\\b\\d{1,5}\\s+[A-Za-z][A-Za-z0-9\\s\\.\\-]{3,40},?\\s+${esc(city)}`,
          "gi",
        ),
        type: "address",
      });
    } else if (city) {
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      addrPatterns.push({
        re: new RegExp(`\\b${esc(city)}\\b`, "gi"),
        type: "address",
      });
    }

    // 2. Location keywords
    const LOCATION_KWS_PLAIN = [
      "located in",
      "based in",
      "headquartered in",
      "our office",
      "our location",
      "visit us at",
      "find us at",
      "we are located",
      "we're located",
      "proudly serving",
      "locally owned",
      "family-owned",
      "get directions",
      "physical address",
    ];
    for (const kw of LOCATION_KWS_PLAIN) {
      addrPatterns.push({
        re: new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        type: "address-kw",
      });
    }

    let count = 0;

    // Walk text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (
            [
              "SCRIPT",
              "STYLE",
              "NOSCRIPT",
              "META",
              "HEAD",
              "TEMPLATE",
              "TEXTAREA",
              "INPUT",
            ].includes(tag)
          )
            return NodeFilter.FILTER_REJECT;
          if (
            tag === "MARK" &&
            (parent.hasAttribute("data-finder-hl") ||
              parent.hasAttribute(HIGHLIGHT_MARK_ATTR))
          )
            return NodeFilter.FILTER_REJECT;
          if (!isElementVisible(parent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    // Collect all matching text nodes
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.textContent;
      for (const { re } of addrPatterns) {
        re.lastIndex = 0;
        if (re.test(raw)) {
          textNodes.push(node);
          break;
        }
      }
    }

    // Replace text nodes with highlighted fragments
    for (const textNode of textNodes) {
      const raw = textNode.textContent;

      // Find all matches across all patterns, sorted by position
      const allMatches = [];
      for (const { re, type } of addrPatterns) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(raw)) !== null) {
          allMatches.push({
            start: m.index,
            end: m.index + m[0].length,
            text: m[0],
            type,
          });
        }
      }
      if (allMatches.length === 0) continue;

      // Sort by start, remove overlaps
      allMatches.sort((a, b) => a.start - b.start);
      const merged = [];
      for (const m of allMatches) {
        if (merged.length > 0 && m.start < merged[merged.length - 1].end)
          continue;
        merged.push(m);
      }

      const frag = document.createDocumentFragment();
      let last = 0;
      for (const { start, end, text, type } of merged) {
        if (start > last)
          frag.appendChild(document.createTextNode(raw.slice(last, start)));
        const mark = document.createElement("mark");
        mark.setAttribute("data-finder-hl", type);
        mark.textContent = text;
        frag.appendChild(mark);
        count++;
        last = end;
      }
      if (last < raw.length)
        frag.appendChild(document.createTextNode(raw.slice(last)));

      try {
        textNode.parentNode.replaceChild(frag, textNode);
      } catch (_) {}
    }

    return count;
  }

  // ── Enhanced extractCompanyLocation with keyword matching ──
  // Wraps the original and appends matchedKeywords to the result.
  // Defined before the message listener so it's available in scope.
  function extractCompanyLocationWithKeywords() {
    const result = extractCompanyLocation();

    // Scan visible page text for location hint keywords
    const bodyText = document.body ? document.body.innerText || "" : "";
    const matched = findLocationKeywords(bodyText);

    // Also check footer / contact / address elements
    const selectors = [
      "footer",
      "address",
      "[class*='contact']",
      "[class*='footer']",
      "[class*='location']",
    ];
    for (const sel of selectors) {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          const t = (el.innerText || el.textContent || "").trim();
          if (t) {
            const kws = findLocationKeywords(t);
            for (const kw of kws) {
              if (!matched.includes(kw)) matched.push(kw);
            }
          }
        });
      } catch (_) {}
    }

    return { ...result, matchedKeywords: matched };
  }

  // ── Register "extractLocation" + "highlightAddresses" message handler ──
  // (Separate lightweight listener just for the location/address actions)

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "extractLocation") {
      try {
        const locationData = extractCompanyLocationWithKeywords();
        sendResponse(locationData);
      } catch (e) {
        console.error("[Finder v5.1] Location extraction error:", e);
        sendResponse({
          primaryCity: null,
          primaryState: null,
          confidence: "none",
          otherLocations: [],
          matchedKeywords: [],
          error: e.message,
        });
      }
      return true;
    }

    if (request.action === "highlightAddresses") {
      try {
        const count = highlightAddressesOnPage(request.locationData || null);
        sendResponse({ success: true, highlightCount: count });
      } catch (e) {
        console.error("[Finder v5.1] Address highlight error:", e);
        sendResponse({ success: false, error: e.message, highlightCount: 0 });
      }
      return true;
    }

    // Not handled here — let other listeners handle it
  });

  console.log("\ud83c\udf21\ufe0f\ud83e\uddf1\ud83c\udfe0\ud83d\udccd HVAC, Hardscaping, Roofing & Address Finder Engine v5.2 loaded.");
})();
