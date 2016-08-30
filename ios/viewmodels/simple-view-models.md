### Motivation

A default iOS view controller patterns encourage putting a lot of view logic in the view controller. This leads to bloated view controller code. 

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

### View Models separates view logic from controllers.

View Models are a pattern that ensures that the logic required to display a model is in a separate entity. 
If formatting logic goes into the view, then it requires the view to have knowledge of the model. This _reduces the reusability of the view_. For example:

```swift
// Don't do this

class SimpleCell: UITableViewCell {
  @IBOutlet private weak var titleLabel: UILabel!
  
  func configure(forExercise exercise: Exercise) {
    switch excercise.type {
      case .HighIntensity:
        titleLabel.textColor = .red()
      default:
        titleLabel.textColor = .blue()
    }
    titleLabel.text = exercise.name
  }
  
  func configure(forResult result: ExerciseResult) {
    switch result.type {
      case .Finished:
        titleLabel.textColor = .blue()
      case .Cancelled:
        titleLabel.textColor = .red()
      default:
        titleLabel.textColor = .green()
    }
    titleLabel.text = result.name
  }
}
```
This leads to bloated views and controllers, and makes the source of truth difficult to reason about.
View models help us out here by ensuring the view has consistent way of getting the information it needs:

```swift
protocol SimpleCellViewModel {
  let titleColor: UIColor
  let title: String
}

class SimpleCell: UITableViewCell {
  @IBOutlet private weak var titleLabel: UILabel!
  
  private func configure(viewModel: SimpleCellViewModel) {
    titleLabel.textColor = viewModel.titleColor
    titleLabel.text = viewModel.title
  }
}
```
We can now ensure that each view model provides the exact information that the view needs by conforming to the view model protocol.

```swift
// ExerciseViewModel.swift
struct ExerciseViewModel: SimpleCellViewModel {
  let titleColor: UIColor
  let title: String
  
  init(exercise: Exercise) {
    switch excercise.type {
      case .HighIntensity:
        titleColor = .red()
      default:
        titleColor = .blue() // having a default color is not compiler enforced due to the type of titleColor
    }
    title = exercise.name
  }
}

// ExerciseResultViewModel.swift
struct ExerciseResultViewModel: SimpleCellViewModel {
  let titleColor: UIColor
  let title: String
  
  init(result: ExerciseResult) {
      case .Finished:
        titleColor = .blue()
      case .Cancelled:
        titleColor = .red()
      default:
        titleColor = .green()
    }
    title = result.name
  }
}
```

### Some other notes

#### Reusability
If the view-model logic is in the controller, or if the view is not re-used, it might not be immediately obvious why you would need a view model. Our recommendation is to consider view models when you have non-trivial logic that bloats the controller or the view. Creating attributed strings for labels is a good candidate.

#### On using protocols
The example shown here uses a protocol so that both model types can create view models with a unified interface. In a simpler scenario, this might not be necessary, but in that case `SimpleTableViewCell` would probably be named `ExerciseTableViewCell`(to support just the `Exercise` model). It is alright to start simple, but aggresively refactor once things get complex. One way to tell when you need this is the presence of several `configureXXX` methods on your view/controller that take different types.

#### View models should not 'import UIKit'
This rule of thumb should be changed to: View models _should not have references to views_. There are times when there are non-trivial view properties that need to be communicated between view models and views - to have a blanket statement regarding the use of UIKit makes for awkward use of view models. For example - if a view needs to take a bezier path as input, we would expect the view model to hold a reference to a UIBezierPath. Other examples that come to mind are UIColor and UIFont.

___________

### References
- https://en.wikipedia.org/wiki/Adapter_pattern
- http://artsy.github.io/blog/2015/09/24/mvvm-in-swift/
