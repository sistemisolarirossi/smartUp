<form ng-show="signedIn() && !(servicereportAddMode || servicereportEditMode)" class="servicereport form-inline">
  <div class="form-group form-group-condensed" title="Filter servicereports by name">
    <div class="right-inner-addon">
      <i class="glyphicon glyphicon-search"></i>
      <input type="text" ng-model="servicereportSelected" typeahead="servicereport as servicereport.name for servicereport in servicereports | orderByPriority | filter:{name: $viewValue} | limitTo:8" class="form-control form-control-search">
    </div>
  </div>
</form>