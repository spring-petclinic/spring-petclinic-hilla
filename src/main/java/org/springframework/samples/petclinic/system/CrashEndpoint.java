package org.springframework.samples.petclinic.system;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.fusion.Endpoint;

@Endpoint
@AnonymousAllowed
public class CrashEndpoint {

	public String triggerException() {
		throw new RuntimeException("Expected: endpoint used to showcase what happens when an exception is thrown");
	}

}
