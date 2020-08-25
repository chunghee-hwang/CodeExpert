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
    private Object getEmptyArray(String dataType) {
        switch (dataType) {
            case "integerArray":
                return new int[] {};
            case "longArray":
                return new long[] {};
            case "booleanArray":
                return new boolean[] {};
            case "doubleArray":
                return new double[] {};
            case "stringArray":
                return new String[] {};
            default:
                return null;
        }
    }

    private Object splitArrayValue(String rawArrayValue, String dataType) {
        boolean isEmptyArray = false;
        isEmptyArray = rawArrayValue.replaceAll("\\s", "").equals("[]");
        if (isEmptyArray) {
            return getEmptyArray(dataType);
        }
        String[] rawArray = rawArrayValue.replaceAll("[\\[\\]\'\"\\s+]", "").split(",");
        Stream<String> valueStream = Arrays.stream(rawArray);
        switch (dataType) {
            case "integerArray":
                return valueStream.mapToInt(Integer::parseInt).toArray();
            case "longArray":
                return valueStream.mapToLong(Long::parseLong).toArray();
            case "booleanArray":
                Object[] stringArray = valueStream.toArray();
                int stringArrayLength = stringArray.length;
                boolean[] booleanArray = new boolean[stringArrayLength];
                for (int idx = 0; idx < stringArrayLength; idx++) {
                    booleanArray[idx] = Boolean.parseBoolean(String.valueOf(stringArray[idx]));
                }
                return booleanArray;
            case "doubleArray":
                return valueStream.mapToDouble(Double::parseDouble).toArray();
            case "stringArray":
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
            case "integerArray":
                return splitArrayValue(rawValue, dataType);
            case "longArray":
                return splitArrayValue(rawValue, dataType);
            case "booleanArray":
                return splitArrayValue(rawValue, dataType);
            case "doubleArray":
                return splitArrayValue(rawValue, dataType);
            case "stringArray":
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
            case "integerArray":
                className = int[].class;
                break;
            case "longArray":
                className = long[].class;
                break;
            case "booleanArray":
                className = boolean[].class;
                break;
            case "doubleArray":
                className = double[].class;
                break;
            case "stringArray":
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
                e.printStackTrace(System.err);
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

    private String toStringAnswer(Object answer) {
        if (answer instanceof int[])
            return Arrays.toString((int[]) answer);
        else if (answer instanceof boolean[])
            return Arrays.toString((boolean[]) answer);
        else if (answer instanceof long[])
            return Arrays.toString((long[]) answer);
        else if (answer instanceof double[])
            return Arrays.toString((double[]) answer);
        else if (answer instanceof String[]) {
            StringBuffer result = new StringBuffer("[");
            int index = 0;
            final int arrayLength = ((String[]) answer).length;
            for (String a : (String[]) answer) {
                result.append("\"");
                result.append(a);
                result.append("\"");
                if (index != arrayLength - 1) {
                    result.append(", ");
                }
                index++;
            }
            result.append("]");
            return result.toString();
        } else if (answer instanceof String) {
            return "\"" + answer + "\"";
        } else {
            return String.valueOf(answer);
        }
    }

    private String formatParameterValues(Object[] parameterValues) {
        String formattedParameterValues = Arrays.deepToString(parameterValues);
        return formattedParameterValues.substring(1, formattedParameterValues.length() - 1);
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
                final String formattedInput = formatParameterValues(parameterValues);

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
                long endTime = System.currentTimeMillis();
                long timeElapsed = endTime - startTime;
                Object answerValue = getParameterOrAnswerValue(answer);
                String formattedAnswer = toStringAnswer(answerValue);
                String formattedUserAnswer = toStringAnswer(userAnswer);
                if (formattedAnswer.equals(formattedUserAnswer)) {
                    printOutput("\n$answer|", outputWriter);
                } else {
                    printOutput("\n$notAnswer|", outputWriter);
                }
                printOutput("\n$expected|" + formattedAnswer, outputWriter);
                printOutput("\n$actual|" + formattedUserAnswer, outputWriter);
                printOutput("\n$input|" + formattedInput, outputWriter);
                printOutput("\n$time|" + timeElapsed, outputWriter);
            } catch (TimeoutException te) {
                printError("\n$timeout|", errorWriter);
            } catch (Exception e) {
                e.printStackTrace(System.err);
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
    }
}