'use strict';
 
app.controller('I18NCtrl', function ($scope, I18N) {

  $scope.i18n = I18N.init();
  $scope.selectedLanguage = $scope.i18n.selectedLanguage;
  $scope.supportedLanguages = $scope.i18n.supportedLanguages;
  $scope.supportedLanguagesSorted = $scope.i18n.supportedLanguagesSorted;
  $scope.selectingLanguageFlag = $scope.i18n.selectingLanguageFlag;

  $scope.getSupportedLanguages = function () {
    return I18N.getSupportedLanguages();
  };
  $scope.getCurrentLanguage = function () {
    return I18N.getCurrentLanguage();
  };
  $scope.getCurrentLanguageName = function () {
    return I18N.getCurrentLanguageName();
  };
  $scope.getCurrentLanguageFlag = function () {
    return I18N.getCurrentLanguageFlag();
  };
  $scope.getCurrentLanguageScript = function () {
    return I18N.getCurrentLanguageScript();
  };
  $scope.setNextLanguage = function () {
    return I18N.setNextLanguage();
  };
  $scope.setCurrentLanguage = function (language) {
    return I18N.setCurrentLanguage(language);
  };
  $scope.selectingLanguage = function () {
    $scope.selectingLanguageFlag = true;
  };
  $scope.languageSelected = function () {
    $scope.selectingLanguageFlag = false;
    return I18N.setCurrentLanguage($scope.selectedLanguage);
  };
});