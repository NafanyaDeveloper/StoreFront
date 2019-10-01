import Vue from 'vue'

var dateFilter =  Vue.filter('date', function (oldValue) { 
  if(oldValue == null)
    return "";
  let parts = oldValue.split('T')[0].split('-');
  return parts[2] + '-' + parts[1] + '-' + parts[0];
})