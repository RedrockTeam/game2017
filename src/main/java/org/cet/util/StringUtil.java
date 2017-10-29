package org.cet.util;

public class StringUtil {

    /**
     * 判断是否为空
     * @param str
     * @return
     */
    public static boolean isBlank(String str) {
        return str == null || str.equals("");
    }

    /**
     * 判断是否有null
     * @param strs
     * @return
     */
    public static boolean hasBlank(String ... strs) {
        if (strs == null || strs.length == 0) {
            return true;
        } else {
            for (String str : strs) {
                if (isBlank(str)) return true;
            }
            return false;
        }
    }
}
