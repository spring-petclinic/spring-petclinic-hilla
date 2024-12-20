package org.springframework.samples.petclinic.endpoint;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class ErrorService {

	public void ping() {
		// Throw a server exception, so as ErrorHandlerView is displayed.
		throw new RuntimeException("Expected: controller used to showcase what happens when an exception is thrown");
	}
}
