// lodash 源码分析
#### 一. chunk 方法
/*
*
* _.chunk(['a', 'b', 'c', 'd'], 2);
* // => [['a', 'b'], ['c', 'd']]
*
* _.chunk(['a', 'b', 'c', 'd'], 3);
* // => [['a', 'b', 'c'], ['d']]
*/
function chunk(array, size, guard) {
  // 传入三个参数，数组 array；分割数组的起始项 size,默认1；guard 默认不传
  if (guard ? isIterateeCall(array, size, guard) : size == null) {
    size = 1;
  } else {
    size = nativeMax(nativeFloor(size) || 1, 1);
  }
  var index = 0,
      length = array ? array.length : 0,
      resIndex = -1,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[++resIndex] = baseSlice(array, index, (index += size));
  }
  return result;
}
分析：

用到的方法：
isIterateeCall：
 function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }
    用到的函数：
      isObject：
      function isObject(value) {
        // Avoid a V8 JIT bug in Chrome 19-20.
        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
      }
      isArrayLike：
        function isArrayLike(value) {
          return value != null && isLength(getLength(value));
        }
        用到的函数：
          isLength：
            function isLength(value) {
              return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
            }
          getLength：
            var getLength = baseProperty('length');

            baseProperty：
            function baseProperty(key) {
              return function(object) {
                return object == null ? undefined : object[key];
              };
            }

      isIndex：
        function isIndex(value, length) {
          value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
          length = length == null ? MAX_SAFE_INTEGER : length;
          return value > -1 && value % 1 == 0 && value < length;
        }

nativeMax：
  nativeMax = Math.max,

nativeFloor：
  nativeFloor = Math.floor
nativeCeil：

  nativeCeil = Math.ceil
Array:
  Array = context.Array;
    context:
      context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
        _.defaults:

           /**
            *  _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
           * // => { 'user': 'barney', 'age': 36 }
           */
          var defaults = createDefaults(assign, assignDefaults);
            createDefaults:
              function createDefaults(assigner, customizer) {
                return restParam(function(args) {
                  var object = args[0];
                  if (object == null) {
                    return object;
                  }
                  args.push(customizer);
                  return assigner.apply(undefined, args);
                });
              }
              restParam:
                /*
                 * say('hello', 'fred', 'barney', 'pebbles');
                 * // => 'hello fred, barney, & pebbles'
                 */
                function restParam(func, start) {
                  if (typeof func != 'function') {
                    throw new TypeError(FUNC_ERROR_TEXT);
                  }
                  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
                  return function() {
                    var args = arguments,
                        index = -1,
                        length = nativeMax(args.length - start, 0),
                        rest = Array(length);

                    while (++index < length) {
                      rest[index] = args[start + index];
                    }
                    switch (start) {
                      case 0: return func.call(this, rest);
                      case 1: return func.call(this, args[0], rest);
                      case 2: return func.call(this, args[0], args[1], rest);
                    }
                    var otherArgs = Array(start + 1);
                    index = -1;
                    while (++index < start) {
                      otherArgs[index] = args[index];
                    }
                    otherArgs[start] = rest;
                    return func.apply(this, otherArgs);
                  };
                }

baseSlice：
  // 几本的分割数组方法
  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    start = start == null ? 0 : (+start || 0);
    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = (end === undefined || end > length) ? length : (+end || 0);
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }
