/**
 * Componente para injetar filtros SVG de daltonismo no DOM
 * Esses filtros são necessários para os modos daltônicos funcionarem
 */
export const ColorBlindFilters = () => {
  return (
    <svg className="accessibility-filters" aria-hidden="true">
      <defs>
        {/* Protanopia Filter - Red-blind */}
        <filter id="protanopia-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>

        {/* Deuteranopia Filter - Green-blind */}
        <filter id="deuteranopia-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0,     0, 0
                    0.7,   0.3,   0,     0, 0
                    0,     0.3,   0.7,   0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>

        {/* Tritanopia Filter - Blue-blind */}
        <filter id="tritanopia-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"
          />
        </filter>
      </defs>
    </svg>
  );
};

