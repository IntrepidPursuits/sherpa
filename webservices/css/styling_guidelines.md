# CSS Style Guide

####The basics:
* If you’re stuck using plain css, use hyphens, not camelCase, because css is case-insensitive.
* Use **single quotes** around strings, double quotes are fine only when there are single quotes inside the string itself.
* Use constants for font styles / sizes, color schemes, etc.
* Semantic class naming: https://maintainablecss.com/chapters/semantics/
* Use classes instead of ids: https://maintainablecss.com/chapters/ids/
* Properties trickle down, so don’t repeat yourself.
* Don’t use `!important` wherever possible.

* Document the project's CSS architecture (the README, component library or style guide are good places to do this), including things such as:
	* Organization of stylesheet directories and Sass partials
	* Selector naming convention
	* Code linting tools and configuration
	* Browser support

* Use Autoprefixer to generate vendor prefixes based on the project-specific browser support that is needed.
* Prefer overflow: auto to overflow: scroll, because scroll will always display scrollbars outside of macOS, even when content fits in the container.
* Use minified code in production
* Use a preprocesser. We like Sass the most, but Less is alright too. Here’s an opinionated style guide on using Sass: [Sass Guidelines](https://sass-guidelin.es/)
* Use flexbox & css grid if you have the option. Here’s a good article that breaks down the old style of arranging pages with css versus the modern way: [How To Approach CSS layouts in 2017 — and beyond. – Flexbox and Grid – Medium](https://medium.com/flexbox-and-grids/css-flexbox-grid-layout-how-to-approach-css-layouts-in-2017-and-beyond-685deef03e6c)
* Use css modules:
	*  [GitHub - css-modules/css-modules: Documentation about css-modules](https://github.com/css-modules/css-modules)
	* [Glen Maddern: Internet Pro](https://glenmaddern.com/articles/css-modules)
* Use a linter. A linter is a program that’s run to catch potential errors in your css. Here’s a great linter configuration for Sass:  [guides/.scss-lint.yml at master · thoughtbot/guides · GitHub](https://github.com/thoughtbot/guides/blob/master/style/sass/.scss-lint.yml)


#### When in doubt, refer to the Thoughtbot css guide

https://github.com/thoughtbot/guides/tree/master/style/sass

#### Avoid using the `&` Sass operator for string interpolation

One of the most useful parts of Sass is being able to use & for nesting to refer to a parent element:

```css
.some-class {
  &:hover {
    color: $bright-color;
  }
}
```

It also possible to use it like this:

```css
.calendar {
  &-month {
    color: $foreman-orange;
  }

  &-week {
    color: $heart-attack-red;
  }
}
```

While this shortcut makes the css a little easier to write, it makes it harder to find where these classes are defined. Since the compiled css file might not always be available or easily accessible, searching across the project for the `.calendar-week` class will not return any results. This violates one of Uncle Bob's Clean Code guidelines.

#### Where possible, use mixins

This will allow you to attempt to make your css object oriented, and theoretically reduce code duplication.

http://thesassway.com/intermediate/using-object-oriented-css-with-sass

#### Define variables for all colors

It's better to have these all defined in one place, where they can be easily referred to and changed.

#### Favor targeting elements rather than pages

Something in suspenders appends some seemingly helpful classes to the `<body>` element that specify the controller and action, but they are a trap. Use separate descriptive class names instead of having a single class that is styled or positioned differently depending on what template was rendered.

####Images as Background*
When adding images to your design, especially if it's going to be responsive, use a <div> tag with the background CSS property instead of <img> elements.

This may seem like more work for nothing, but it actually makes it much easier to style images properly, keeping their original size and aspect-ratio, thanks to background-size, background-position, and other properties.

CSS / HTML
```
img {
    width: 300px;
    height: 200px;
}

div {
    width: 300px;
    height: 200px;
    background: url('https://tutorialzine.com/media/2016/08/bicycle.jpg');
    background-position: center center;
    background-size: cover;
}

section{
    float: left;
    margin: 15px;
}
```

A drawback of this technique is that the web accessibility of your page will take a slight hit, as images won't be crawled properly by screen readers and search engines. This issue can be resolved by the awesome object-fit but it doesn't have full browser support yet.


####Don’t forget to comment:
CSS might not be a programming language but its code still needs to be documented. Some simple comments are all it takes to organize a style sheet and make it more accessible to your colleagues or your future self.
For larger sections of the CSS such as major components or media-queries, use a stylized comment and leave a couple of new lines after:
```
/*---------------
    #Header
---------------*/
header { }

header nav { }

/*---------------
    #Slideshow
---------------*/
.slideshow { }
```

Details in the design or less important components can be marked with a single-line comment.

```
/*   Footer Buttons   */
.footer button { }

.footer button:hover { }
```

Also, remember that CSS doesn't have single line  comments, so when commenting something out you still need to use the / / syntax.

```
/*  Do  */
p {
    padding: 15px;
    /*border: 1px solid #222;*/
}

/*  Don't  */
p {
    padding: 15px;
    // border: 1px solid #222;  
}
```


The above two tips are taken from [20 Tips For Writing Modern CSS - Tutorialzine](https://tutorialzine.com/2016/08/20-protips-for-writing-modern-css), which has a number of other decent best practices as well.
