package org.springframework.samples.petclinic.vet;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.fusion.Endpoint;
import com.vaadin.fusion.Nonnull;

@Endpoint
@AnonymousAllowed
public class VetEndpoint {

	private VetRepository service;

	public VetEndpoint(@Autowired VetRepository service) {
		this.service = service;
	}

	@Nonnull
	public Collection<@Nonnull Vet> list() {
		return this.service.findAll();
	}

}
