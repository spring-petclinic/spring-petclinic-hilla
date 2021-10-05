package org.springframework.samples.petclinic.owner;

import java.util.List;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.fusion.Endpoint;
import com.vaadin.fusion.Nonnull;

@Endpoint
@AnonymousAllowed
public class PetEndpoint {

	private PetRepository service;

	public PetEndpoint(PetRepository service) {
		this.service = service;
	}

	@Nonnull
	public List<@Nonnull PetType> findPetTypes() {
		return service.findPetTypes();
	}

	public Pet findById(Integer id) {
		return service.findById(id);
	}

	@Nonnull
	public Integer save(Pet pet) {
		return service.save(pet).getId();
	}

}
