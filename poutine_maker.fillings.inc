<?php

function poutine_maker_fillings($filter=NULL) {
  $fillings = array(
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
    return $fillings;
  case 'all':
    return array_merge($fillings['meat'], $fillings['veg']);
  case 'machine':
    return array_map('_poutine_maker_make_machine_name', poutine_maker_fillings('all'));
  default:
    return $fillings[$filter];
  }
}

function _poutine_maker_make_machine_name($name) {
  return str_replace(' ', '_', strtolower($name));
}
