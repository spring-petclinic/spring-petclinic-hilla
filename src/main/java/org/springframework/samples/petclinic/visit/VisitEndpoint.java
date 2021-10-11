package org.springframework.samples.petclinic.visit;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.model.BaseEntity;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.fusion.Endpoint;
import com.vaadin.fusion.Nonnull;

@Endpoint
@AnonymousAllowed
public class VisitEndpoint {

	private VisitRepository service;

	public VisitEndpoint(VisitRepository service) {
		this.service = service;
	}

	/**
	 * Save a <code>Visit</code> to the data store, either inserting or updating it.
	 * @param visit the <code>Visit</code> to save
	 * @see BaseEntity#isNew
	 */
	@Nonnull
	public Integer save(Visit visit, Integer petId) throws DataAccessException {
		visit.setPetId(petId);
		return service.save(visit).getId();
	}

	@Nonnull
	public List<@Nonnull Visit> findByPetId(Integer petId) {
		return service.findByPetId(petId);
	}

}
