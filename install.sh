# !/bin/sh
# ref: https://www.cnblogs.com/embedded-linux/p/6206064.html
# read -s -n 1 -p "any key ... "

is_exist_command() {
    if hash $1 2>/dev/null; then
        echo "$1 command does exist."
    else
        echo "$1 command does not exist. Install it using brew tool." && exit -1
    fi
}

is_exist_command curl
is_exist_command unzip

TMP_DIR=native_src/output/tmp
TARGET_DIR=native_src

CPP_NAME=ext_sdk_cpp
CPP_VERSION=0.1.0
JAVA_NAME=ext_sdk_java
JAVA_VERSION=0.1.0
OBJC_NAME=ext_sdk_objc
OBJC_VERSION=0.1.0

rm -rf ${TMP_DIR}
rm -rf ${TARGET_DIR}
mkdir -p ${TMP_DIR}
mkdir -p ${TARGET_DIR}

curl -o ${TMP_DIR}/${CPP_NAME}.zip -L https://github.com/AsteriskZuo/${CPP_NAME}/archive/refs/tags/v${CPP_VERSION}.zip
curl -o ${TMP_DIR}/${JAVA_NAME}.zip -L https://github.com/AsteriskZuo/${JAVA_NAME}/archive/refs/tags/v${JAVA_VERSION}.zip
curl -o ${TMP_DIR}/${OBJC_NAME}.zip -L https://github.com/AsteriskZuo/${OBJC_NAME}/archive/refs/tags/v${OBJC_VERSION}.zip

unzip -q -d ${TARGET_DIR} ${TMP_DIR}/${CPP_NAME}.zip
unzip -q -d ${TARGET_DIR} ${TMP_DIR}/${JAVA_NAME}.zip
unzip -q -d ${TARGET_DIR} ${TMP_DIR}/${OBJC_NAME}.zip

mv ${TARGET_DIR}/${CPP_NAME}-${CPP_VERSION} ${TARGET_DIR}/cpp
mv ${TARGET_DIR}/${JAVA_NAME}-${JAVA_VERSION} ${TARGET_DIR}/java
mv ${TARGET_DIR}/${OBJC_NAME}-${OBJC_VERSION} ${TARGET_DIR}/objc
