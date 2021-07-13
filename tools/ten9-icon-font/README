# ten9-icon-font

## Opening the Icon set

1. Open https://icomoon.io/app/#/projects
1. Click Import Project and load the tools/ten9-icon-font/icomoon/selection.json file
1. Rename the new project "ten9-icons" and click Load

## Adding to the Icon set

Use Chrome's dev tools to inspect the element and the DOM to find the name of the Google icon you want to add.
Once you know the name of the Google icon you want to add, you can look up its offset in
`tools/ten9-icon-font/google/waffle.css` file.  Look for the class named `.docs-material .docs-icon-xxx-xxx` 
where docs-icon-xxx-xxx is the name of the class you found in the DOM.

In this example, we want to add the icon for text rotation up. In Dev Tools, inspect element we can see the name is `docs-icon-text-rotation-angleup`. Find the
name of the icon in the waffle.css file and note the offset.

In this example the offset is -20, -3699 so we look in the svg for (20,3699)

waffle.css:

```css
.docs-material .docs-icon-sheets-ia-text-rotate-angle-up {
    left: -20px;
    top: -3699px
}
```

material_common_sprite284.svg:

```xml
  <g transform="translate(20,3699)">
    <path
      d="M3 4.898438L6.316406 12.1875l1.101563-1.101562L6.601562 9.375l2.03125-2.03125 1.710938.824219 1.101562-1.101563L4.148438 3.75zM7.386719 6.75L6 8.136719 4.695312 5.496094l.058594-.058594zM9.75 10.5V9h4.5v4.5h-1.5v-1.941406l-3.800781 3.800781-1.058594-1.058594L11.691406 10.5zm0 0"
      fill-rule="nonzero" fill="#000" fill-opacity="1" />
  </g>
```

Create a new file with the name of the icon and put it in the svgs directory.

Example: svgs/sheets-ia-text-rotate-angle-up.svg

Contents of the file:

You can preview the file in vscode with the SVG extension. You may need to add a
transform and play with the viewbox and height and width to make it look good. See
other svg files as examples. Once you have the svg file you can import it to IcoMoon
icon set and see how it looks. Delete it and edit the svg again if needed to make it
right.

To import the icon, in icomoon click the Hamburger menu for the ten9 Icon Set and
click Import to Set. Then find the new svg file and click Open.

When done adding all the SVGs, select them all and click Generate Font in IcoMoon. Download
the zip, uncompress it, and update the contents in the icomoon folder in this project.

Take the new ten9-icon.woff file and replace it in the grapheditor project.  Take style.scss
and variables.scss into the project as well and rename them.

Do a `yarn stylelint --fix` also to clean up the SCSS.

Commit and push all changes in both projects.
