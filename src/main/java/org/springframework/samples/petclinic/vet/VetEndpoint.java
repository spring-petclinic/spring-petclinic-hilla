package org.springframework.samples.petclinic.vet;

import java.util.Collection;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class VetEndpoint {

	private VetRepository service;

	public VetEndpoint(VetRepository service) {
		this.service = service;
	}

	@Nonnull
	public Collection<@Nonnull Vet> list() {
		return service.findAll();
	}

}
