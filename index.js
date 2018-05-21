const sass = require('node-sass')

const returnCustomColors = function(config) {
  const map = new Map()

  Object.keys(config.customColors).forEach(key => {
    map.set(key, config.customColors[key])
  })

  let colorsString = ""

  map.forEach((value, key) => {
    colorsString += `"${key}":(${value}, findColorInvert(${value})),`
  })

  return `$addColors: (${colorsString});
          $colors: map-merge($colors, $addColors);`

}

// CHECKLIST
//
// Import colors -                ✔
// Import custom colors -         ✘/✔
// Import shades -                ✔
// Import 'appearance'(radius) -  ✔ 
// Import 'adv'(customCSS) -      ✔
// Import 'adv'(fontFamily) -     ✘/✔

exports.generate = (req, res) => {
  if (req.body.name === undefined) {
    // This is an error case, as "message" is required.
    res.status(400).send('No config defined!')
  } else {

    try {
      
      const config = req.body

      var sassBody = `
      /*! Theme generated by BulmaThemeGenerator |  https://github.com/m-kutnik */
      @import "./node_modules/bulma/sass/utilities/initial-variables";
      @import "./node_modules/bulma/sass/utilities/functions";
      
      $radius: ${config.appearance.borderRadius}px;
      
      $background-color: ${config.colors.background};
      $primary-color: ${config.colors.primary};
      $primary-color-invert: findColorInvert($primary-color);
      $link-color: ${config.colors.link};
      $link-color-invert: findColorInvert($link-color);
      $info-color: ${config.colors.info};
      $info-color-invert: findColorInvert($info-color);
      $success-color: ${config.colors.success};
      $success-color-invert: findColorInvert($success-color);
      $warning-color: ${config.colors.warning};
      $warning-color-invert: findColorInvert($warning-color);
      $danger-color: ${config.colors.danger};
      $danger-color-invert: findColorInvert($danger-color);
      
      // Color theme
      
      $black: ${config.shades["black"]};
      $black-bis: ${config.shades["black-bis"]};
      $black-ter: ${config.shades["black-ter"]};
      $grey-darker: ${config.shades["grey-darker"]};
      $grey-dark: ${config.shades["grey-dark"]};
      $grey-light: ${config.shades["grey-light"]};
      $grey-lighter: ${config.shades["grey-lighter"]};
      $white-ter: ${config.shades["white-ter"]};
      $white-bis: ${config.shades["white-bis"]};
      $white: ${config.shades["white"]};
      
      // Import derived-variables.sass
      @import "./node_modules/bulma/sass/utilities/derived-variables.sass";
      
      // Bind Colors
      
      $primary: $primary-color;
      $primary-invert: $primary-color-invert;
      $link: $link-color;
      $link-invert: $link-color-invert;
      $info: $info-color;
      $info-invert: $info-color-invert;
      $success: $success-color;
      $success-invert: $success-color-invert;
      $warning: $warning-color;
      $warning-invert: $warning-color-invert;
      $danger: $danger-color;
      $danger-invert: $danger-color-invert;
      $body-background-color: $background-color;
      $link: $primary-color;
      $link-hover: lighten($primary-color, 15%);
      
      // Fonts
      
      $family-primary: "${config.adv.fontFamily}, " +  $family-sans-serif;
      
      // Custom Colors
      
      ${(Object.keys(config.customColors).length === 0 ) ? "" : returnCustomColors(config)}
      // $addColors: (
      //   "main":($main-color, $main-color-invert),
      //   "secondary":($secondary-color, $secondary-color-invert),
      //   "twitter":($twitter, $twitter-invert),
      // );
      // $colors: map-merge($colors, $addColors);
      
      // Box
      $box-background-color: $white-ter;
      
      // Card
      $card-background-color: $white-ter;
      
      // Import the rest of Bulma
      @import "./node_modules/bulma/bulma";
      
      html {
        border-radius: $radius;
      }
      ${config.adv.customCSS}
      `

      var result = sass.renderSync({
        // file: './node_modules/bulma/bulma.sass',
        data: sassBody,
        outputStyle: 'compressed'
      })

      res.status(200).send(result.css.toString())
    } catch (e) {
      return res.status(400).send('Error in config' + e)
    }
  }
}
