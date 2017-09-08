# PJSIP: How to build native libraries fo Android

(PJSIP is an open-source C/C++ library that provides SIP functionality)

This assumes that the export `ANDROID_NDK_ROOT` is set to the appropriate NDK directory.

This text is written as if you build the entire PJSIP stack for the first time and need to start from scratch.  
If you need to build the PJSIP stack later again - but for different architectures (abis) - skip all steps except the ones written in **bold**.

Notes

*   The directory `/Users/user` is just an example directory. if you want, just replace the string _`user`_ with your own user-name.
*   The target abi `armeabi-v7a` can be replaced with other abis, such as `x86` or `x86_64`, etc.
*   For 64 bit builds (e.g. x86_84) be sure to set the target and build-api level to at least 21.  
    In other words, replace all below occurrences of `19` with `21`.

Here are the steps to build PJSIP for Android:

1.  Download PJSIP (2.6.0)  
    [http://www.pjsip.org]
2.  Download OpenSSL (1.0.2l)  
    [https://www.openssl.org/source/]  
3.  Download OpenSSL-build  
    [https://github.com/VoiSmart/pjsip-android-builder/blob/master/openssl-build]
4.  Download or git-clone OpenH264  
    [https://github.com/cisco/openh264.git] 

5.  Build OpenSSL:  
    (`./openssl-1.0.2l` is the root-directory of your OpenSSL download)  

    1.  **create or clear directory: `/Users/user/openssl-output`**
    2.  **cd into dir where the openssl-build file is located.**
    3.  execute:  
        **`./openssl-build $ANDROID_NDK_HOME ./openssl-1.0.2l 19 armeabi-v7a 4.9 /Users/user/openssl-output`**  

    
6.  Build OpenH264
    1.  **cd into the root-directory of your OpenH264 download/clone, e.g. `/User/user/openh264`**
    2.  edit Makefile
        1.  change `PREFIX=android`
    3.  create directory `android` (same value as `PREFIX`)
    4.  for armeabi-v7a builds, execute:  
        **`make OS=android NDKROOT=$ANDROID_NDK_ROOT TARGET=android-19 NDKLEVEL=19 clean`**  
        **`make OS=android NDKROOT=$ANDROID_NDK_ROOT TARGET=android-19 NDKLEVEL=19 install`**
    5.  for other abi builds, execute (x86 is just an example here):  
        **`make OS=android NDKROOT=$ANDROID_NDK_ROOT TARGET=android-19 NDKLEVEL=19 ARCH=x86 clean`**  
        **`make OS=android NDKROOT=$ANDROID_NDK_ROOT TARGET=android-19 NDKLEVEL=19 ARCH=x86 install`**  


7.  Build PJSIP
    1.  There is an issue with carriage return with the configuration-executables.  
        To fix this, execute:  
        `tr -d '\r' < ./configure-android > ./configure-android-fixed`
    2.  On lines 3 and 4 add this to the 'configure-android-fixed' file:  
        `APP_PLATFORM=android-19`  
        **`TARGET_ABI=armeabi-v7a`**
    3.  Do '`chmod 777`' on the files '`configure-android-fixed`', '`configure`' and '`aconfigure`'.
    4.  Create the file `./pjlib/include/pj/config_site.h`  
        Add this text:  
        `#define PJ_CONFIG_ANDROID 1`  
        `#define PJMEDIA_HAS_VIDEO 1`  
        `#include <pj/config_site_sample.h>`
    5.  Configure build for android. Execute:  
        **`./configure-android-fixed --use-ndk-cflags --with-ssl=/Users/user/openssl-output/ --with-openh264=/Users/user/openh264/android`**
    6.  Build it:  
        **`make dep && make clean && make`**
    7.  Build the SUA sample app:
        1.  There may be an issue with the makefile ./pjsip-apps/src/swig/java/Makefile.  
            Check if these lines are correct and make them look like the lines below:  
            (`armeabi` should be replace with `$(TARGET_ABI)` and one instance of `$(LIBPJSUA2_SO)` should be replaced with `$(PJ_CXX)`)
            ```
            ifeq ($(OS),android)  
                LIBPJSUA2_SO=android/app/src/main/jniLibs/$(TARGET_ABI)/libpjsua2.so  
            else
            ...  
            ...  
                mkdir -p android/app/src/main/jniLibs/$(TARGET_ABI)  
            endif
                $(PJ_CXX) -shared -o $(LIBPJSUA2_SO) $(OUT_DIR)/pjsua2_wrap.o \  
                            $(MY_CFLAGS) $(MY_LDFLAGS)
            ...
            ```
        2.  Execute:  
            **`cd ./pjsip-apps/src/swig`**  
            **`make clean`**  
            **`make TARGET_ABI=armeabi-v7a`**    

8.  **For your Android app, grab these .so files and put them into the appropriate directories of your gradle project:**
    1.  From PJSIP directory: `./pjsip-apps/src/swig/java/android/app/src/main/jniLibs/_armeabi-v7a_/*.so`
    2.  From OpenSSL output directory: `/Users/user/openssl-output/lib/*.a`  
        (create an *.so from these two *.a files later, this will be part of the gradle project building the app)
    3.  From OpenH264 directory: `/Users/user/openh264/android/lib/*.so`