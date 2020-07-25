package com.goodperson.code.expert;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Stream;

public class JavaCompiler {

    private Object splitArrayValue(String rawArrayValue, String dataType) {
        String[] rawArray = rawArrayValue.replaceAll("[\\[\\]\'\"\\s+]", "").split(",");
        Stream<String> valueStream = Arrays.stream(rawArray);
        switch (dataType) {
            case "integer_array":
                return valueStream.mapToInt(Integer::parseInt).toArray();
            case "long_array":
                return valueStream.mapToLong(Long::parseLong).toArray();
            case "boolean_array":
                Object[] stringArray = valueStream.toArray();
                int stringArrayLength = stringArray.length;
                boolean[] booleanArray = new boolean[stringArrayLength];
                for (int idx = 0; idx < stringArrayLength; idx++) {
                    booleanArray[idx] = Boolean.parseBoolean(String.valueOf(stringArray[idx]));
                }
                return booleanArray;
            case "double_array":
                return valueStream.mapToDouble(Double::parseDouble).toArray();
            case "string_array":
                return rawArray;
            default:
                return null;
        }
    }

    private Object getParameterOrAnswerValue(String parameter) throws Exception {
        String[] dataTypeAndValue = parameter.split(":");
        String dataType = dataTypeAndValue[0];
        String rawValue = dataTypeAndValue[1];
        switch (dataType) {
            case "boolean":
                return Boolean.parseBoolean(rawValue);
            case "string":
                return rawValue.replaceAll("\"", "");
            case "long":
                return Long.parseLong(rawValue);
            case "integer":
                return Integer.parseInt(rawValue);
            case "double":
                return Double.parseDouble(rawValue);
            case "integer_array":
                return splitArrayValue(rawValue, dataType);
            case "long_array":
                return splitArrayValue(rawValue, dataType);
            case "boolean_array":
                return splitArrayValue(rawValue, dataType);
            case "double_array":
                return splitArrayValue(rawValue, dataType);
            case "string_array":
                return splitArrayValue(rawValue, dataType);
            default:
                throw new Exception("DataType info is not correct.");
        }
    }

    private Class<?> getParameterClass(String parameter) throws Exception {
        Class<?> className;
        String dataType = parameter.split(":")[0];
        switch (dataType) {
            case "boolean":
                className = boolean.class;
                break;
            case "string":
                className = String.class;
                break;
            case "long":
                className = long.class;
                break;
            case "integer":
                className = int.class;
                break;
            case "double":
                className = double.class;
                break;
            case "integer_array":
                className = int[].class;
                break;
            case "long_array":
                className = long[].class;
                break;
            case "boolean_array":
                className = boolean[].class;
                break;
            case "double_array":
                className = double[].class;
                break;
            case "string_array":
                className = String[].class;
                break;
            default:
                throw new Exception("DataType info is not correct.");
        }
        return className;
    }

    private Class<?>[] getClassArrayFromParameters(String[] parameters) {
        return Arrays.stream(parameters).map(parameter -> {
            try {
                return getParameterClass(parameter);
            } catch (Exception e) {
                return null;
            }
        }).toArray(Class<?>[]::new);
    }

    private Object[] getValueFromParameters(String[] parameters) {
        return Arrays.stream(parameters).map(parameter -> {
            try {
                return getParameterOrAnswerValue(parameter);
            } catch (Exception e) {
                return null;
            }
        }).toArray();
    }

    public JavaCompiler(String[] args) throws Exception {
        try (BufferedWriter outputWriter = new BufferedWriter(new OutputStreamWriter(System.out));
                BufferedWriter errorWriter = new BufferedWriter(new OutputStreamWriter(System.err));) {
            Future<Object> future = null;
            try {
                int lenArgs = args.length;
                int to = Integer.parseInt(args[0]);
                String[] parameters = Arrays.copyOfRange(args, 1, lenArgs - 1);
                String answer = args[lenArgs - 1];
                Method method = getClass().getDeclaredMethod("solution", getClassArrayFromParameters(parameters));
                Object[] parameterValues = getValueFromParameters(parameters);

                ExecutorService executor = Executors.newCachedThreadPool();
                Callable<Object> task = new Callable<Object>() {
                    @Override
                    public Object call() throws Exception {
                        return method.invoke(JavaCompiler.this, parameterValues);
                    }
                };
                future = executor.submit(task);

                long startTime = System.currentTimeMillis();
                Object userAnswer = future.get(to, TimeUnit.MILLISECONDS);
                long timeElapsed = System.currentTimeMillis() - startTime;
                Object answerValue = getParameterOrAnswerValue(answer);
                if (answerValue.equals(userAnswer)) {
                    printOutput("$answer|", outputWriter);
                } else {
                    printOutput("$not_answer|" + answerValue + "|" + String.valueOf(userAnswer), outputWriter);
                }
                printOutput("$time|" + timeElapsed, outputWriter);
            } catch (TimeoutException te) {
                printError("$timeout|", errorWriter);
            } catch (Exception e) {
                printError(e.getMessage(), errorWriter);
            } finally {
                future.cancel(true);
                System.exit(0);
            }
        }
    }

    private void printOutput(String str, BufferedWriter outputWriter) throws Exception {
        outputWriter.write(str);
        outputWriter.newLine();
        outputWriter.flush();
    }

    private void printError(String str, BufferedWriter errorWriter) throws IOException {
        errorWriter.write(str);
        errorWriter.newLine();
        errorWriter.flush();
    }

    public static void main(String[] args) throws Exception {
        new JavaCompiler(args);
        // String[] testArgs = new String[] { "timeout:5000", "integer_array:[1, 2, 3,
        // 4]", "integer:10" };
        // new JavaCompiler(testArgs);
    }

    // public int solution(int[] array) {
    // return Arrays.stream(array).reduce(0, (a, b) -> a + b);
    // }
}