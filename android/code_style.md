# Adding a Shared Code Style to Android Studio

You'll find the Intrepid code style template in this directory, it's
called "Intrepid.xml".

Copy the template into the code styles directory of your Studio
installation:

`~/Library/Preferences/{AndroidStudio directory}/codestyles`.

Note that the Android Studio directory will depend on the
version you're using.  For instance, if you're on 1.5, it'll be
`AndroidStudio1.5`.  If the codestyles subdirectory isn't already
there, just create it.

You might need to restart Android Studio in order to refresh the code
styles list, but after these steps you should see the new code style
show up in the list of options when configuring `Editor -> Code Style`

![Alt text](images/code-style.png)

Our code style is a living document - if you have suggested changes,
please bring them up on the #android Slack channel for discussion and
we'll go from there!

### Syncing the code style file
Code style settings can also be checked into git and have the changes 
be automatically synced across team members. This can be done by checking
`.idea/codeStyles/codeStyleConfig.xml` into git and set the code style
scheme in the settings dialog to `Project`. Normally, we put the whole
`.idea` folder under gitignore. However, we can make an exception for the
code style file by putting the following lines in gitignore instead:
```
.idea/*
!.idea/codeStyles/codeStyleConfig.xml
```
