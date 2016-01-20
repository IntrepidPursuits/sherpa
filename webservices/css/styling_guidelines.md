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
