# Tidbits
A collection of random (but helpful!) bits of Android/Java/Kotlin knowledge

# Table of Contents
1. [Kotlin](#kotlin)
   1. [Mock singleton objects in Kotlin](#mocksingletonobject)

## Kotlin

<a name="mocksingletonobject" />

### How to mock singleton `object`s in Kotlin without using PowerMock

#### MySingleton.kt - the definition of your Singleton object
```kotlin
@VisibleForTesting
var mySingletonDelegate: MySingletonIfc? = null

// The delegate here is the "secret sauce" which allows us to specify an alternative implementation
//   (such as for testing), or, if it was not set, then use the default implementation defined below.
object MySingleton: MySingletonIfc by mySingletonDelegate ?: MySingletonImpl

private object MySingletonImpl : MySingletonIfc {
  override fun foo(): String {
    // Actual implementation
  }
}

interface MySingletonIfc {
  fun foo(): String
}
```

#### BaseTest.kt - ALL unit tests must derive from this, otherwise you may run into initialization issues
```kotlin
@Mock
protected lateinit var mockMySingleton: MySingletonIfc

@Before
fun baseSetup() {
  // Note that the extra level of delegation is critical here
  // Specifying "mySingletonDelegate = mockMySingleton" is not good enough, as the mocked object on its own
  //   doesn't sufficiently override/initialize the default implementation (for some unknown reason)
  mySingletonDelegate = object : MySingletonIfc by mockMySingleton {}
}
```

#### YourTest.kt - To override this mocked singleton in your tests, you can now do the following:
```kotlin
whenever(mockMySingleton.foo()).thenReturn(“A mocked string response”)
```
