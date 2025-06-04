
const { Op } = require('sequelize');

//
// ─── SUPPORTED QUERY EXAMPLES ────────────────────────────────────────────────
//

/**
 * ✅ BASIC FIELD FILTERING:
 *   ?amount_gt=100             → WHERE amount > 100
 *   ?title_like=cleaner        → WHERE title LIKE '%cleaner%'
 *   ?is_show=true              → WHERE is_show = true
 *
 * ✅ ASSOCIATED MODEL FILTERING:
 *   ?user.name_like=John       → JOIN User ON ... WHERE user.name LIKE '%John%'
 *   ?category.slug=plumbing    → JOIN Category ON ... WHERE category.slug = 'plumbing'
 *
 * ✅ DATE RANGE FILTERING:
 *   ?job_date_from=2024-01-01  → WHERE job_date >= '2024-01-01'
 *   ?job_date_to=2024-01-31    → WHERE job_date <= '2024-01-31'
 *
 * ✅ PAGINATION & SORTING:
 *   ?page=2&limit=10           → LIMIT 10 OFFSET 10
 *   ?sort=-createdAt           → ORDER BY createdAt DESC
 */

//
// ─── FILTER BUILDING ─────────────────────────────────────────────────────────
//

const operatorMapping = {
  eq: Op.eq,
  gt: Op.gt,
  gte: Op.gte,
  lt: Op.lt,
  lte: Op.lte,
  like: Op.like
};

/**
 * Parses a query key like "amount_gt" or "user.name_like"
 */
function parseFilterKey(key) {
  const parts = key.split('_');
  const opKey = parts.pop();
  const fullKey = parts.join('_');

  const [model, field] = fullKey.includes('.') ? fullKey.split('.') : [null, fullKey];

  return {
    model,
    field,
    operator: operatorMapping[opKey] || Op.eq
  };
}

/**
 * Build filters from query parameters.
 */
function buildFilters(query, allowedFields = [], allowedRelations = {}) {
  const baseFilters = {};
  const includeFilters = {};

  for (const rawKey of Object.keys(query)) {
    const value = query[rawKey];
    if (!value) continue;

    // Handle explicit date range filters
    if (rawKey.endsWith('_from') || rawKey.endsWith('_to')) {
      const field = rawKey.replace(/_(from|to)$/, '');
      if (!allowedFields.includes(field)) continue;

      if (!baseFilters[field]) baseFilters[field] = {};
      if (rawKey.endsWith('_from')) {
        baseFilters[field][Op.gte] = new Date(value);
      } else {
        baseFilters[field][Op.lte] = new Date(value);
      }
      continue;
    }

    // Parse other types
    const { model, field, operator } = parseFilterKey(rawKey);

    if (!model && allowedFields.includes(field)) {
      if (operator === Op.like) {
        baseFilters[field] = { [Op.like]: `%${value}%` };
      } else if (operator !== Op.eq) {
        baseFilters[field] = { [operator]: value };
      } else {
        baseFilters[field] = value;
      }
    }

    if (model && allowedRelations[model]?.includes(field)) {
      if (!includeFilters[model]) includeFilters[model] = {};
      if (operator === Op.like) {
        includeFilters[model][field] = { [Op.like]: `%${value}%` };
      } else if (operator !== Op.eq) {
        includeFilters[model][field] = { [operator]: value };
      } else {
        includeFilters[model][field] = value;
      }
    }
  }

  return { baseFilters, includeFilters };
}

//
// ─── PAGINATION & SORTING ─────────────────────────────────────────────────────
//

function buildPaginationAndSorting(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const sortField = (query.sort || 'createdAt').replace(/^-/, '');
  const sortOrder = query.sort?.startsWith('-') ? 'DESC' : 'ASC';

  return {
    pagination: { limit, offset },
    sort: [[sortField, sortOrder]],
    meta: { page, limit }
  };
}

//
// ─── EXPORT ───────────────────────────────────────────────────────────────────
//

module.exports = {
  buildFilters,
  buildPaginationAndSorting
};
