package org.springframework.samples.petclinic.endpoint;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.exception.EndpointException;

import java.io.PrintWriter;
import java.io.StringWriter;

@BrowserCallable
@AnonymousAllowed
public class ErrorService {

	public void ping() {
		// Throw a server exception with stacktrace in detail
		RuntimeException cause = new RuntimeException("Expected: controller used to showcase what happens when an exception is thrown");
		StringWriter sw = new StringWriter();
		cause.printStackTrace(new PrintWriter(sw));
		throw new EndpointException(cause.getMessage(), cause, sw.toString());
	}
}
