package org.jsimek.cameltutorial.utils;

import io.quarkus.logging.LoggingFilter;
import java.util.logging.Filter;
import java.util.logging.LogRecord;

@LoggingFilter(name = "lsp-filter")
public final class LSPFilter implements Filter {


    @Override
    public boolean isLoggable(LogRecord record) {
        return !record.getLoggerName().equals("main");
    }
}