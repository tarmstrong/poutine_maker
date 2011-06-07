<?php

function poutine_maker_toppings($filter=NULL) {
  $toppings = array(
    'meat' => array(
      'Chicken', 'Beef', 'Pork', 'Turkey',
    ),
    'veg' => array(
      'Lettuce', 'Tomato', 'Olives', 'Cheese', 'Beans', 'Sweet Potato', 'Tofu',
      'Guacomole', 'Honey Mustard Sauce',
    ),
  );
  switch ($filter) {
  case NULL:
    return $toppings;
  case 'all':
    return array_merge($toppings['meat'], $toppings['veg']);
  case 'machine':
    return array_map('_poutine_maker_make_machine_name', poutine_maker_toppings('all'));
  default:
    return $toppings[$filter];
  }
}

function _poutine_maker_make_machine_name($name) {
  return str_replace(' ', '_', strtolower($name));
}
