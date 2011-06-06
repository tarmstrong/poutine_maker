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
  default:
    return $fillings[$filter];
  }
}
