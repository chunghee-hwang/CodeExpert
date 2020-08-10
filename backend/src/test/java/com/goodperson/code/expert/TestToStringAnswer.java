package com.goodperson.code.expert;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestToStringAnswer {

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
        } else{
            return String.valueOf(answer);
        }
    }

    @Test
    public void testToStringAnswer() {
        Object answer = 11;
        System.out.println(toStringAnswer(answer));

        answer = "11";
        System.out.println(toStringAnswer(answer));

        answer = new String[] { "11", "22", "33" };
        System.out.println(toStringAnswer(answer));

        answer = new int[] { 1, 3, 5 };
        System.out.println(toStringAnswer(answer));

        answer = new boolean[] { false, true, false };
        System.out.println(toStringAnswer(answer));
    }
}