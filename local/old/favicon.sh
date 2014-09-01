#!/bin/bash
#
# Favicon and Apple Touch Icon Generator
#
# This bash script takes an image as a parameter, and uses ImageMagick to convert it to several
# other formats used on modern websites. The following copies are generated:
#
# * apple-touch-icon-144x144-precomposed.png
# * apple-touch-icon-114x114-precomposed.png
# * apple-touch-icon-57x57-precomposed.png
# * apple-touch-icon-72x72-precomposed.png
# * apple-touch-icon-precomposed.png
# * apple-touch-icon.png
# * favicon.ico
 
CONVERT_CMD="`which convert`"
SRC_IMAGE="$1"
DST_DIR="${2:-.}"
TMP_DIR="/tmp/`basename $0`.$$"
 
if [ -z $CONVERT_CMD ] || [ ! -f $CONVERT_CMD ] || [ ! -x $CONVERT_CMD ]; then
  echo "ImageMagick needs to be installed to run this script"
  exit 1
fi
 
if [ -z $SRC_IMAGE ]; then
  echo "You must supply a source image as the argument to this command"
  exit 1
fi
 
if [ ! -f $SRC_IMAGE ]; then
  echo "Source image \"$SRC_IMAGE\" does not exist"
  exit 1
fi
 
if [ ! -d "$TMP_DIR" ]; then
  mkdir -p "/../$TMP_DIR"
  if [ $? -ne 0 ]; then
    echo "Error creating temporary directory \"$TMP_DIR\""
    exit 1
  fi
fi

if [ ! -d "$DST_DIR" ]; then
  echo "Destination directory \"$DST_DIR\" must exist"
  exit 1
fi

echo "Generating square base image"
$CONVERT_CMD $SRC_IMAGE -resize 256x256! -transparent white $TMP_DIR/favicon-256.png
 
echo "Generating various sizes for ico"
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 16x16 $TMP_DIR/favicon-16.png
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 32x32 $TMP_DIR/favicon-32.png
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 64x64 $TMP_DIR/favicon-64.png
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 128x128 $TMP_DIR/favicon-128.png
 
echo "Generating ico"
#$CONVERT_CMD $TMP_DIR/favicon-16.png $TMP_DIR/favicon-32.png $TMP_DIR/favicon-64.png $TMP_DIR/favicon-128.png $TMP_DIR/favicon-256.png -colors 256 $TMP_DIR/favicon.ico
$CONVERT_CMD $TMP_DIR/favicon-16.png -colors 256 $DST_DIR/favicon.ico

echo "Generating touch icons"
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 57x57 $DST_DIR/apple-touch-icon.png
cp $DST_DIR/apple-touch-icon.png $DST_DIR/apple-touch-icon-precomposed.png
cp $DST_DIR/apple-touch-icon.png $DST_DIR/apple-touch-icon-57x57-precomposed.png
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 72x72 $DST_DIR/apple-touch-icon-72x72-precomposed.png
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 114x114 $DST_DIR/apple-touch-icon-114x114-precomposed.png
$CONVERT_CMD $TMP_DIR/favicon-256.png -resize 144x144 $DST_DIR/apple-touch-icon-144x144-precomposed.png
 
echo "Removing temp files"
rm -rf $TMP_DIR/favicon-16.png
rm -rf $TMP_DIR/favicon-32.png
rm -rf $TMP_DIR/favicon-64.png
rm -rf $TMP_DIR/favicon-128.png
rm -rf $TMP_DIR/favicon-256.png
rmdir $TMP_DIR

echo "Icons generated in directory \"$DST_DIR\""
exit 0