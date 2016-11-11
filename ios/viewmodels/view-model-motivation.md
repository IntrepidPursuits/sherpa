# Motivation

iOS View Controllers are responsible for a lot of things - view containment, animations, i/o, among others. On top of that, we often put view logic into the view controllers, leading to view controller bloat. View models encourage the separation of view logic into a separate entity. This class's sole responsibility is to convert model information into a form that is easily consumable by the view.

#### What do we mean by view logic?

Given a model:

```swift
struct Exercise {
  let name: String
  let duration: NSTimeInterval
  let type: ExerciseType
}

let exercise = Exercise(name: "Bootcamp Workout III", duration: 90.0, type: .HighIntensity)

```
View logic might be the logic that converts the model type `.HighIntensity` to be represented as a certain color on the screen.

When using views that can display multiple models, you might run into a situation where the view needs to know too much about every kind of model that it can display.
```swift
// Don't do this

class ExerciseViewController: UIViewController {
  @IBOutlet private weak var titleLabel: UILabel!

  func configure(forExercise exercise: Exercise) {
    let color: UIColor
    switch excercise.type {
    case .HighIntensity:
      color = .red()
    default:
      color = .blue()
    }

    let titleAttributes = [NSForegroundAttributeName: UIFont.cellFont(), NSForegroundAttributeColor: color]
    
    let durationFormatter = ExerciseDurationFormatter()
    let title = NSMutableAttributedString(exercise.name + " - ", attributes: titleAttributes)
    title.appendAttributedString(NSAttributedString(durationFormatter.formatNumber(exercise.duration), attributes: titleAttributes))
    titleLabel.attributedText = title
    
    ...
    }
}

```

The view controller here starts to get pretty large just to accomodate the formatting of one label. This problem is compounded for the combination of multiple labels, switches, table views, buttons that are in a view controller.


View models can help by moving view logic into the view model class. This simplifies the view implementation by abstracting out the view logic details into a separate class.

```swift
struct ExerciseViewModel {
  let title: NSAttributedString
  
  init(exercise: Exercise) {
    let color: UIColor
    switch excercise.type {
    case .HighIntensity:
      color = .red()
    default:
      color = .blue()
    }

    let titleAttributes = [NSForegroundAttributeName: UIFont.cellFont(), NSForegroundAttributeColor: color]
    
    let durationFormatter = ExerciseDurationFormatter()
    let title = NSMutableAttributedString(exercise.name + " - ", attributes: titleAttributes)
    title.appendAttributedString(NSAttributedString(durationFormatter.formatNumber(exercise.duration), attributes: titleAttributes))
    self.title = title
  }
}

```

At first this might seem as though we simply moved the 'mess' from one object to the other, but the responsibilities of these two classes are vastly different. The sole responsibility of ExerciseViewModel is to leave the formatting(in a general sense) of the model out of the view and view controller.

This allows this class to be tested, and for the view to be potentially reused. This also encourages us to think clearly about the models that are required to produce our view, and stating those assumptions explicitly.


### Some other notes

#### Reusability
It is still possible to shoot yourself in the foot with view models. In a non trivial use case, one view might need to display several different kinds of models. See [View Model Reuse](view-model-reuse.md).

#### On naming
View Models are tightly coupled with views, and should be renamed according to the views that they are used in. Here are some suggestions:
```
ProfileViewController - ProfileViewModel
NestSettingsViewController - NestSettingsViewModel

NewsFeedTableViewCell - NewsFeedTableViewCellViewModel
HRVView - HRVViewModel
GuestsPieChart - GuestsPieChartViewModel
```

#### View models should not 'import UIKit'
This rule of thumb should be changed to: View models _should not have references to views_. There are times when there are non-trivial view properties that need to be communicated between view models and views - to have a blanket statement regarding the use of UIKit makes for awkward use of view models. For example - if a view needs to take a bezier path as input, we would expect the view model to hold a reference to a UIBezierPath. Other examples that come to mind are UIColor and UIFont.

___________

### References
- https://en.wikipedia.org/wiki/Adapter_pattern
- http://artsy.github.io/blog/2015/09/24/mvvm-in-swift/
