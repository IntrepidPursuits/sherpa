# How to get complete code coverage in unit tests for a nullable `var`

### The example
If you're writing unit tests for a Kotlin class, you may not see complete code coverage for code like this (even if you're testing `bar()` with both null & non-null values of `foo`):
```kotlin
class Example {
    private var foo: String? = null
    
    fun bar() {
        if(foo != null) {
            foo?.size()
        }
    }
}
```

Because `foo` is a var, the compiler can't guarantee that another thread won't access it and change its value between the time you check `if(foo != null)` and the time you call `foo?.size()`.
This is why you have to use the `?` when calling `foo.size()` - because the compiler won't smart cast the `var` from `String?` to `String` even though you're inside a null-checking if statement.

Unless you want to write tests that actually capture the value of `foo` changing mid-method, it's much better to write this code like this:
```kotlin
class Example {
    private var foo: String? = null
    
    fun bar() {
        foo?.let {
            it.size()
        }
    }
}
```

In this 2nd example, the compiler automatically creates a constant `val` reference to `foo` that's internal to the `let` block, and can therefore guarantee that `foo` (`it` inside the `let` block) is non-null.
This also eliminates the code coverage issue as the value is only checked for null once.

In my opinion, this approach is also much cleaner than handling it yourself by manually creating a temporary `val` like this:
```kotlin
class Example {
    private var foo: String? = null
    
    fun bar() {
        val copyOfFoo = foo
        if(copyOfFoo != null) {
            copyOfFoo.size()
        }
    }
}
```

### Background
What was initially baffling about this was that I was using a nullable `var` such as in the example above, and this class only had two methods which both had `synchronized` blocks wrapping all changes to `foo`.
It took me a while to tumble to the fact that the compiler was worried about multi-threaded access, and that this was one instance where the code coverage tool just isn't smart enough to be able to determine that multithreaded access was not a concern.
