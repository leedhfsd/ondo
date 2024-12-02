package com.clio.ondo.domain.mission.model;

import java.util.ArrayList;
import java.util.Collection;

public class MissionDetailList<E> extends ArrayList<E> {

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("[");
		for (int i = 0; i < size(); i++) {
			sb.append(i+1 + ". ").append(get(i));
			if (i < size() - 1) {
				sb.append(", ");
			}
		}
		sb.append("]");
		return sb.toString();
	}

	public MissionDetailList(Collection<? extends E> c) {
		super(c);
	}
}

