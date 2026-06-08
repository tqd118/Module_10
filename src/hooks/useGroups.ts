import { useState } from "react";
import { gql } from "@/api/graphql";
import type { Group } from "@/types/social";

const GROUP_FIELDS = `
    id
    title
    photo
    membersCount
`;

interface CreateGroupInput {
    title: string;
    photo: string;
}

interface UpdateGroupInput {
    title?: string;
    photo?: string;
}

export function useGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = async () => {
        setLoading(true);
        setError(null);

        try {
            const { allGroups } = await gql<{ allGroups: Group[] }>(`
                query {
                    allGroups {
                        ${GROUP_FIELDS}
                    }
                }
            `);

            setGroups(allGroups);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load groups");
        } finally {
            setLoading(false);
        }
    }

    const fetchGroup = async (groupId: number): Promise<Group> => {
        try {
            const { group } = await gql<{ group: Group }>(
                `query Group($groupId: Int!) {
                    group(groupId: $groupId) {
                        ${GROUP_FIELDS}
                    }
                }`,
                { groupId }
            );

            return group;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Filed to load group");
        }
    }

    const createGroup = async (input: CreateGroupInput): Promise<Group> => {
        try {
            const { createGroup } = await gql<{ createGroup: Group }>(
                `mutation CreateGroup($input: CreateGroupInput!) {
                    createGroup(input: $input) {
                        ${GROUP_FIELDS}
                    }
                }`,
                { input }
            );

            setGroups(prev => [...prev, createGroup]);

            return createGroup;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to create group");
        }
    }

    const updateGroup = async (groupId: number, input: UpdateGroupInput): Promise<Group> => {
        try {
            const { updateGroup } = await gql<{ updateGroup: Group }>(
                `mutation UpdateGroup($groupId: Int!, $input: UpdateGroupInput!) {
                    updateGroup(groupId: $groupId, input: $input) {
                        ${GROUP_FIELDS}
                    }
                }`,
                { groupId, input }
            );

            setGroups(prev => prev.map(g => g.id === groupId ? updateGroup : g));

            return updateGroup;
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to update group");
        }
    }

    const deleteGroup = async (groupId: number): Promise<void> => {
        try {
            await gql<{ deleteGroup: { success: boolean } }>(
                `mutation DeleteGroup($groupId: Int!) {
                    deleteGroup(groupId: $groupId) {
                        success
                    }
                }`,
                { groupId }
            );

            setGroups(prev => prev.filter(g => g.id !== groupId));
        } catch (e) {
            throw e instanceof Error ? e : new Error("Failed to delete group");
        }
    }

    return {
        groups,
        loading,
        error,
        fetchGroups,
        fetchGroup,
        createGroup,
        updateGroup,
        deleteGroup,
    }
}
