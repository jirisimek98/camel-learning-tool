package org.jsimek.cameltutorial.utils;

import java.util.logging.*;

public class LogFormatter extends Formatter {

    @Override
    public String format(LogRecord record) {
        return String.format("%1$tF %1$tT [%2$s] %3$s %n",
                record.getMillis(), record.getLoggerName(), formatMessage(record));
    }
}