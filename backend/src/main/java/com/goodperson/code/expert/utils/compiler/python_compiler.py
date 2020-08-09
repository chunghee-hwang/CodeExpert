import sys
import time
from threading import Thread
import functools
import re


def timeout(timeout_deco):
    def deco(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            res = [TimeoutError()]

            def newFunc():
                try:
                    res[0] = func(*args, **kwargs)
                except Exception as e:
                    res[0] = e
            t = Thread(target=newFunc)
            t.daemon = True
            try:
                t.start()
                t.join(timeout_deco/1000)
            except Exception as je:
                raise je
            ret = res[0]
            if isinstance(ret, BaseException):
                raise ret
            return ret
        return wrapper
    return deco


def split_array_value(array_value):
    return re.sub('[\\[\\]\'\"\s+]', '', array_value).split(',')


def argv_to_python_code(data_type_and_value):
    data_type, value = data_type_and_value.split(':')
    if data_type == 'boolean':
        if value == 'true':
            value = True
        else:
            value = False
    elif data_type == 'string':
        value = str(value).replace("\"", '')
    elif data_type == 'long' or data_type == 'integer':
        value = int(value)
    elif data_type == 'double':
        value = float(value)
    elif data_type == 'integerArray' or data_type == 'longArray':
        value = list(map(int, split_array_value(value)))
    elif data_type == 'booleanArray':
        value = list(map(bool, splitArray_value(value)))
    elif data_type == 'doubleArray':
        value = list(map(float, split_array_value(value)))
    elif data_type == 'stringAray':
        value = list(map(str, split_array_value(value)))
    return value


if __name__ == '__main__':
    argv = sys.argv
    len_argv = len(argv)
    to = int(argv[1])
    parameters = argv[2:len_argv-1]
    answer = argv[len_argv-1]
    parameters = [argv_to_python_code(parameter) for parameter in parameters]
    answer = argv_to_python_code(answer)
    solution = timeout(to)(solution)
    try:
        start_time = time.monotonic()
        user_answer = solution(*parameters)
        time_elapsed = round((time.monotonic() - start_time)*1000, 2)
        if answer == user_answer:
            print('$answer|')
        else:
            print('$notAnswer|'+str(answer)+'|' + str(user_answer))
        print('$time|'+str(time_elapsed))
    except TimeoutError as toe:
        print('$timeout|', file=sys.stderr)
    except Exception as e:
        print(e, file=sys.stderr)
