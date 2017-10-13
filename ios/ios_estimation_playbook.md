# iOS Estimation Playbook

**Case Study: Yoga by Numbers iOS**

The purpose of this playbook is to document examples of user stories for each of our story point estimate values. It will not cover Intrepid’s Agile estimation methodologies, as those are well documented already, but instead will provide a baseline against which future project teams can determine relative estimates for their own stories.

An example user story for each story point value is provided, along with a brief outline of scope, links to relevant code samples and a mockup. (YbN used 1, 2, 4, 8, 16 pt scale rather than Fibonacci, but those point values have been translated to Fibonacci for this example).


## 1

As a user, I want to be able to buy the YbN mat

**Scope:**

- Add a button that opens the mat purchase URL in Safari

**Relevant code:**

- [YBNOnboardingMatOwnerViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Onboarding/YBNOnboardingMatOwnerViewController.m#L89)

**Mockups:**

![Image1](./Estimation_Playbook_Images/image1.png)

## 1

As a user, I want to toggle annotations on or off

**Scope:**

- Add a user defaults setting for annotations on/off
- Respect setting when determining whether or not to show annotation
- This story does not include the Video Settings UI, that was completed in a previous sprint

**Relevant code:**
- [YBNSessionVideoPlayerViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Sessions/YBNSessionVideoPlayerViewController.m)
- [YBNSessionVideoSettings](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Models/Settings/YBNSessionVideoSettings.m)
- [YBNSessionVideoSettingsViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Sessions/YBNSessionVideoSettingsViewController.m)

**Mockups:**

![Image2](./Estimation_Playbook_Images/image2.png)

## 2

As a user, I want to be able to share on social media if I have completed a class

**Scope:**

- Add share button to session completion UI
- Provide user with standard iOS share sheet
- Configure default content per share platform

**Relevant code:**

- [YBNSessionsLogSessionDifficultyRatingViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Sessions/YBNSessionsLogSessionDifficultyRatingViewController.m)
- [UIActivityViewController](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIActivityViewController_Class/)
- [Link to PR encompassing work scope](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/pull/32/files)

**Mockups:**

![Image3](./Estimation_Playbook_Images/image3.png)

## 2

As a user, before logging in, I want to know what YbN is and what the app does.

This story is just about 100% view layout. There is very little backing logic aside from the action handling and navigation code.

**Scope:**

- Create UI for app landing screen
- Provide navigation to Sign Up, Log in, and Video Preview

**Relevant code:**

- [YBNOnboardingWelcomeViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Onboarding/YBNOnboardingWelcomeViewController.m)
- [YBNInnerShadowButton](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Views/YBNInnerShadowButton/YBNInnerShadowButton.m)


**Mockups:**

![Image4](./Estimation_Playbook_Images/image4.png)

## 3

As a user I want to create a new YbN account with my email address

**Scope:**

- Text entry of the user’s full name, email and password
- Validation of all entry fields
- Network call for creating a new user
- UI related to text entry and submission, including custom styling for text fields and “Sign up” button
- Scrolling of content to prevent keyboard overlap

**Relevant code:**

- [YBNOnboardingSignUpViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Onboarding/YBNOnboardingSignUpViewController.m)
- [YBNUserService](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Networking/Services/YBNUserService.m)
- [YBNAuthenticationUser](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Models/Authentication/YBNAuthenticationUser.m)/[YBNAuthenticationUserViewModel](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewModels/Authentication/YBNAuthenticationUserViewModel.m)
- [YBNUser](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Models/UserGenerated/YBNUser.m)
- [YBNBorderedTextField](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Views/YBNBorderedTextField/YBNBorderedTextField.m)
- [Link to PR encompassing work scope](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/pull/14)

**Mockups:**

![Image5](./Estimation_Playbook_Images/image5.png)

## 5

As a user, I want to be able to view pose videos

**Scope:**

- Request poses from the server
- Deserialize and map server response to pose objects
- Display a list of poses in a collection view
- Create pose collection view cell
- Handle selection by launching a pose video player

**Relevant code:**

- [YBNLearnPoseViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Learn/YBNLearnPoseViewController.m)
- [YBNLearnService](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Networking/Services/YBNLearnService.m)
- [YBNPose](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/Models/UserGenerated/YBNPose.m)/[YBNPoseViewModel](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewModels/Learn/YBNPoseViewModel.m)
- [YBNPoseVideoPlayerController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Video/YBNPoseVideoPlayerViewController.m)
- [Link to PR encompassing work scope](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/pull/59)

**Mockups:**

![Image6](./Estimation_Playbook_Images/image6.png)

## 8

As a user, I want to watch the class video and control playback

The estimate for this user story is a good example of complexity vs. amount of work. Implementing the basic functionality of the video player was not all that difficult, but there are a lot of moving parts within the AVFoundation framework and many usage scenarios to handle. An estimate of 8 ensures that the developer will have the time to think about and test these scenarios along with any edge cases (i.e. related to network condition, how the video responds to manual scrubbing, etc)

**Scope:**

- Leverage AVPlayer to build a streaming video playback solution
- Implement custom playback controls including play/pause button, skip back 30 seconds button, and scrubber
- Create custom UI for Airplay indicator

**Relevant code:**

- [AVPlayer](https://developer.apple.com/library/mac/documentation/AVFoundation/Reference/AVPlayer_Class/)
- [YBNVideoPlayerViewController](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/blob/develop/YogaByNumbers/ViewControllers/Video/YBNVideoPlayerViewController.m)
- [Link to PR encompassing work scope](https://github.com/IntrepidPursuits/yoga-by-numbers-ios/pull/4)

**Mockups:**

![Image7](./Estimation_Playbook_Images/image7.png)
