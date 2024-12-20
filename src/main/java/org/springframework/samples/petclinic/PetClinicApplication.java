/*
 * Copyright 2012-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.samples.petclinic;

import java.util.List;
import java.util.Locale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.i18n.DefaultI18NProvider;
import com.vaadin.flow.i18n.I18NProvider;
import com.vaadin.flow.server.PWA;
import com.vaadin.flow.theme.Theme;

/**
 * PetClinic Spring Boot Application.
 */
@NpmPackage(value = "react-error-boundary", version = "4.0.13")
@SpringBootApplication
@Theme("petclinic")
@PWA(name = "Pet Clinic", shortName = "Pet Clinic", offlineResources = { "icons/icon.png" })
public class PetClinicApplication extends SpringBootServletInitializer implements AppShellConfigurator {

    public static void main(String[] args) {
        SpringApplication.run(PetClinicApplication.class, args);
    }
	@Bean
	public I18NProvider myProvider() {
		return new DefaultI18NProvider(List.of(Locale.forLanguageTag("en"), Locale.forLanguageTag("de"), Locale.forLanguageTag("es")));
	}
}
