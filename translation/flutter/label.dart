
//#pragma: imports
import 'dart:convert';

//#pragma: execution
GestureDetector(onTap:(){ dynamic event;##TRIGGERS## }, child:Text("${StringWrapper(##SOURCE##).value != '' ? StringWrapper(##SOURCE##).value : '[[label]]'}", style: Theme.of(context).textTheme.headlineMedium)),