<?php

/**
 * @file
 *
 * Functions that return data used in the poutine_maker field.
 */

/**
 * Return an array in the form
 *
 * array(
 *   'sweet_potato' => 'Sweet Potato',
 *   'tomato' => 'Tomato',
 *   ...
 * );
 */
function poutine_maker_toppings() {
  return array_merge(poutine_maker_toppings_veg(), poutine_maker_toppings_meat());
}

function poutine_maker_toppings_veg() {
  return _poutine_maker_toppings_make_assoc(array(
    'Pepper Sauce', 'Cheese Curds', 'Peppers', 'Tomato', 'Olives', 'Cheese', 'Beans', 'Sweet Potato', 'Tofu',
    'Guacomole',
  ));
}

function poutine_maker_toppings_meat() {
  return _poutine_maker_toppings_make_assoc(array(
    'Gravy', 'Chicken', 'Beef', 'Pork', 'Turkey', 'Smoked Meat',
  ));
}

function _poutine_maker_toppings_make_assoc($arr) {
  $newarr = array();
  foreach ($arr as $el) {
    $newarr[_poutine_maker_make_machine_name($el)] = $el;
  }
  return $newarr;
}

function _poutine_maker_make_machine_name($name) {
  return str_replace(' ', '_', strtolower($name));
}
